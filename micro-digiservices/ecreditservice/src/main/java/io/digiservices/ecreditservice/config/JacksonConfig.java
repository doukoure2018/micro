package io.digiservices.ecreditservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Configuration
public class JacksonConfig {

    private static final String DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS";

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
        return builder -> {
            // Format de date
            builder.simpleDateFormat(DATE_TIME_FORMAT);

            // Désactiver l'écriture des dates comme timestamps
            builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            // Configurer le module JavaTime avec format personnalisé
            JavaTimeModule javaTimeModule = new JavaTimeModule();

            // Serialisation : format fixe avec microsecondes (sortie stable).
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_TIME_FORMAT);
            javaTimeModule.addSerializer(LocalDateTime.class,
                    new LocalDateTimeSerializer(formatter));
            // Deserialisation TOLERANTE : accepte l'ISO avec 0 a 9 decimales de seconde
            // (ex. "2027-06-16T00:00:00", "...07.247", "...59.123456"). L'ancien format
            // rigide en .SSSSSS faisait echouer le decodage des reponses Feign (ebanking/SAF).
            javaTimeModule.addDeserializer(LocalDateTime.class,
                    new LocalDateTimeDeserializer(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            builder.modules(javaTimeModule);
        };
    }

    /**
     * Le mapper de tout le service, construit a partir du builder ci-dessus.
     *
     * <p>Piege repare le 28/10/2026 : ce bean existait, mais il fabriquait un
     * {@code new ObjectMapper()} a la main. Declarer un bean {@code ObjectMapper} fait taire
     * l'auto-configuration de Spring Boot — et donc le {@code Jackson2ObjectMapperBuilderCustomizer}
     * juste au-dessus, qui n'etait plus applique a personne. Resultat :
     * {@code WRITE_DATES_AS_TIMESTAMPS} restait actif, un {@code OffsetDateTime} partait en
     * nombre de secondes depuis 1970 et l'ecran, qui lit des millisecondes, affichait
     * « 21/01/1970 18:06 » a la place de la date du jour (journal des habilitations).</p>
     *
     * <p>En passant par le builder, le service a un seul reglage de dates : format texte,
     * jamais d'horodatage numerique, et la lecture tolerante de l'ISO pour les reponses
     * Feign d'ebanking et de SAF.</p>
     */
    @Bean
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        return builder.build();
    }

    /* Alternative: Bean ObjectMapper personnalisé */
    /*
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_TIME_FORMAT);

        javaTimeModule.addSerializer(LocalDateTime.class,
            new LocalDateTimeSerializer(formatter));
        javaTimeModule.addDeserializer(LocalDateTime.class,
            new LocalDateTimeDeserializer(formatter));

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(javaTimeModule);
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        return objectMapper;
    }
    */
}