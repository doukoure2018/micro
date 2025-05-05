package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.SG_USUARIOS;
import io.digiservices.ebanking.exception.BlogAPIException;
import io.digiservices.ebanking.paylaod.SG_USUARIOSDto;
import io.digiservices.ebanking.paylaod.UsariosPKId;
import io.digiservices.ebanking.repository.UsuarioRepository;
import io.digiservices.ebanking.service.SG_USUARIOSService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SG_USUARIOSServiceImpl implements SG_USUARIOSService {
    private UsuarioRepository usuarioRepository;
    private ModelMapper mapper;

    public SG_USUARIOSServiceImpl(UsuarioRepository usuarioRepository, ModelMapper mapper) {
        this.usuarioRepository = usuarioRepository;
        this.mapper = mapper;
    }

    @Override
    public boolean existeUsuarios(UsariosPKId usariosPKId) {
        if(usariosPKId == null) {
            return false;
        }
        return usuarioRepository.existsById(usariosPKId);
    }

    @Override
    public boolean isActive_usuarios(UsariosPKId usariosPKId) {
        SG_USUARIOS user =usuarioRepository.getReferenceById(usariosPKId);
        return user.getIndActivo().equals("A");
    }

    @Override
    public String getActiveUser(UsariosPKId usariosPKId) {
        SG_USUARIOS user =usuarioRepository.getReferenceById(usariosPKId);
        return user.getIndActivo();
    }

    @Override
    public String getCodAgencia(UsariosPKId usariosPKId) {
        SG_USUARIOS user =usuarioRepository.getReferenceById(usariosPKId);
        return mapper.map(user, SG_USUARIOSDto.class).getUsariosPKId().getCodAgencia();
    }

    @Override
    public Boolean is_agent(UsariosPKId usariosPKId) {
        if(!usuarioRepository.existsById(usariosPKId)){
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Cet usager n'existe pas dans le point de service indiqué");
        }
        SG_USUARIOS user =usuarioRepository.getOne(usariosPKId);
        return user.getCodPuesto().equals("AGENCR");
    }

    @Override
    public Boolean is_caisse(UsariosPKId usariosPKId) {
        SG_USUARIOS user =usuarioRepository.getReferenceById(usariosPKId);
        if(!user.getCodPuesto().equals("CAIS")){
            return false;
        }
        return true;
    }

    @Override
    public Boolean getActiveUser(String codUser) {
        String codPs = codUser.substring(codUser.length()-3);
        SG_USUARIOS agent = usuarioRepository.getReferenceById(new UsariosPKId("00000",codPs,codUser));
        return agent.getIndActivo().equals("A");
    }

    @Override
    public SG_USUARIOSDto getUsuarios(UsariosPKId usariosPKId) {
        SG_USUARIOS usuarios=usuarioRepository.getReferenceById(usariosPKId);
        return mapToDTO(usuarios);
    }

    @Override
    public List<SG_USUARIOSDto> getListUsuariosByCodAgencia(String codAgencia, String codPuesto, String indActivo) {
        List<SG_USUARIOS> usuarios=usuarioRepository.findByUsariosPKIdCodAgenciaAndCodPuestoAndIndActivo(codAgencia,codPuesto,indActivo);
        return usuarios.stream().map((sg_usuarios)->mapToDTO(sg_usuarios)).collect(Collectors.toList());
    }

    // convert Entity into DTO
    private SG_USUARIOSDto mapToDTO(SG_USUARIOS usuarios){
        SG_USUARIOSDto sg_usuariosDto = mapper.map(usuarios, SG_USUARIOSDto.class);
        return sg_usuariosDto;
    }

    // convert DTO to entity
    private SG_USUARIOS mapToEntity(SG_USUARIOSDto sg_usuariosDto){
        SG_USUARIOS sg_usuarios = mapper.map(sg_usuariosDto, SG_USUARIOS.class);
        return sg_usuarios;
    }
}
