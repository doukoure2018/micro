package io.digiservices.ebanking.dto;

import io.digiservices.ebanking.entity.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PersonneM {

    private Clientes clientes;
    private PersonneMorale personneMorale;
    private DirClientes dirClientes;
    private IdClientes idClientes;
    private Identification identification;
    private Serie serie;

    private NumCartDto numCartDto;


}
