package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.ReqCreditoPKId;
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
@Getter
@Setter
@Entity
@Table(name = "PR_REQ_CREDITO",schema = "PR")
public class ReqCredito {
    @EmbeddedId
    private ReqCreditoPKId reqCreditoPKId;
    private String IND_ESTADO;
    private String IND_OBLIGATORIO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_ULT_PRESENTACION;
}
