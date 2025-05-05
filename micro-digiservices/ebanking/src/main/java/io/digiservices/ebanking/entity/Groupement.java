package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.GroupementPKId;
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
@Table(name = "CL_VINCULACIONES",schema = "CL")
public class Groupement {

    @EmbeddedId
    private GroupementPKId groupementPKId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_REGISTRO;
}
