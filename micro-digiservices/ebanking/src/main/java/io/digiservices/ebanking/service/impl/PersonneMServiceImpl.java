package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.dto.NumCartDto;
import io.digiservices.ebanking.dto.OpenAccountResponse;
import io.digiservices.ebanking.dto.PersonneM;
import io.digiservices.ebanking.entity.*;
import io.digiservices.ebanking.paylaod.*;
import io.digiservices.ebanking.repository.*;
import io.digiservices.ebanking.service.PersonneMService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PersonneMServiceImpl implements PersonneMService {

    private ClientesRepository clientesRepository;
    private IdClientesRepository idClientesRepository;
    private DirClientesRepository dirClientesRepository;
    private IdentificationRepository identificationRepository;
    private SerieRepository serieRepository;
    private CalendariosRepository calendariosRepository;
    private PersonneMoraleRepository personneMoraleRepository;


    @Override
    @Transactional
    public OpenAccountResponse createMembreM(PersonneM personneM, String codPs) {
        try {
            // Get Information of calendar
            Calendarios calendarios=calendariosRepository.getReferenceById(new CalendariosPKId("CL","00000",codPs));

            //Add Info IdClientesDto
            Clientes clientes =personneM.getClientes();

            // Get the last serie
            Serie serie=serieRepository.getReferenceById(new SeriePKId("00000","CL","CLIENTES"));
            serie.setVAL_SIGUIENTE(serie.getVAL_SIGUIENTE()+1);
            serieRepository.save(serie);

            // Determination du numero de compte du client
            String codClientes="";
            if (String.valueOf(serie.getVAL_SIGUIENTE()).length() == 5) {
                codClientes = codPs + "000" + serie.getVAL_SIGUIENTE();
            } else if (String.valueOf(serie.getVAL_SIGUIENTE()).length() == 6) {
                codClientes = codPs + "00" + serie.getVAL_SIGUIENTE();
            } else if (String.valueOf(serie.getVAL_SIGUIENTE()).length() == 7) {
                codClientes = codPs + "0" + serie.getVAL_SIGUIENTE();
            } else {
                codClientes = codPs + serie.getVAL_SIGUIENTE();
            }

            clientes.setFEC_INGRESO(calendarios.getFEC_HOY());
            clientes.setClientesPKId(new ClientesPKId(codClientes,"00000"));
            clientes.setCodAgencia(codPs);
            clientes.setIND_RELACION("C");
            clientesRepository.save(clientes);

            // Add Info Personne Morale
            PersonneMorale personneMorale=personneM.getPersonneMorale();
            personneMorale.setPersonneMoralePKId(new PersonneMoralePKId("00000",codClientes));
            personneMoraleRepository.save(personneMorale);

            // Add Info DirClientes
            DirClientes dirClientes = personneM.getDirClientes();
            dirClientes.setDirClientesPKId(new DirClientesPKId("00000",codClientes,"1"));
            dirClientes.setTIP_DIRECCION("C");
            dirClientesRepository.save(dirClientes);

            // add Info
            IdClientes idClientes=personneM.getIdClientes();
            // Obtenir les informations de la carte d'identification
            NumCartDto numCartDto=personneM.getNumCartDto();
            idClientes.setIdClientesPKId(new IdClientesPKId("00000",codClientes,numCartDto.getTipId(),numCartDto.getNumId()));
            idClientes.setFEC_VENCIM(calendarios.getFEC_HOY());
            idClientesRepository.save(idClientes);

            //Add Information Identification
            Identification identification=personneM.getIdentification();
            identification.setFECH_INGRESO(calendarios.getFEC_HOY());
            identification.setTIP_ASOCIADO("N");
            identification.setIND_ESTADO("A");
            identification.setIdentificationPKId(new IdentificationPKId("00000",codClientes));

            identificationRepository.save(identification);

            OpenAccountResponse response=new OpenAccountResponse();
            response.setMessage("success");
            return response;

        } catch (Exception e) {
            // rollback implicite
            throw e;
        }

    }

    @Override
    public String getCodeCliente(String codPs) {

        // Get the last serie
        Serie serie=serieRepository.getReferenceById(new SeriePKId("00000","CL","CLIENTES"));
        serie.setVAL_SIGUIENTE(serie.getVAL_SIGUIENTE());
        //serieRepository.save(serie);

        // Determination du numero de compte du client
        String codClientes="";
        if (String.valueOf(serie.getVAL_SIGUIENTE()).length() == 5) {
            codClientes = codPs + "000" + serie.getVAL_SIGUIENTE();
        } else if (String.valueOf(serie.getVAL_SIGUIENTE()).length() == 6) {
            codClientes = codPs + "00" + serie.getVAL_SIGUIENTE();
        } else if (String.valueOf(serie.getVAL_SIGUIENTE()).length() == 7) {
            codClientes = codPs + "0" + serie.getVAL_SIGUIENTE();
        } else {
            codClientes = codPs + serie.getVAL_SIGUIENTE();
        }
        return  codClientes;
    }
}
