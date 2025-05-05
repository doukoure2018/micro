package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.CalendariosPKId;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "CF_CALENDARIOS",schema = "CF")
public class Calendarios {

    @EmbeddedId
    private CalendariosPKId calendariosPKId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_HOY;
    private String NOM_DIA;
    private String FEC_ANTERIOR;
    private String PRIMER_DIA_MES;
    private String PRIMER_HABIL_MES;
    private String ULT_DIA_MES;
    private String ULT_HABIL_MES;
}
