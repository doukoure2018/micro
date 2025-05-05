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
public class PersonneP {

    private Clientes clientes;
    private Personas personas;
    private DirClientes dirClientes;
    private IdClientes idClientes;
    private Identification identification;
    private Serie serie;
    private NumCartDto numCartDto;
}
