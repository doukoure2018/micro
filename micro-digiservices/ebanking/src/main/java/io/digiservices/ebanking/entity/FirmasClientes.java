package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.FirmasClientesPkId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "CC_FIRMAS_CLIENTE",schema = "CC")
public class FirmasClientes {

    @EmbeddedId
    private FirmasClientesPkId firmasClientesPkId;
    private String CTG_FIRMA;
    private String TIP_CLIENTE;
}
