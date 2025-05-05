package io.digiservices.ebanking.dto;

import io.digiservices.ebanking.entity.Compte;
import io.digiservices.ebanking.entity.FirmasClientes;
import io.digiservices.ebanking.entity.Mouvement;
import io.digiservices.ebanking.entity.Serie;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OpenAccount {

    private Compte compte;
    private FirmasClientes firmasClientes;
    private Mouvement mouvement;
    private Serie serie;

}
