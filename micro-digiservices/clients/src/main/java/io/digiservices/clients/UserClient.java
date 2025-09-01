package io.digiservices.clients;

import io.digiservices.clients.domain.AgenceDto;
import io.digiservices.clients.domain.DelegationDto;
import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.clients.domain.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.ok;

@FeignClient("userservice")
public interface UserClient {

    @GetMapping(path = "/user/getUser/{userId}")
    User getUserById(
            @PathVariable(name = "userId") Long userId);

    @GetMapping(path = "/user/client/pointvente/{idPs}")
    PointVenteDto getPointVenteClient(@PathVariable(name = "idPs") Long idPs);

    @GetMapping(path = "/user/client/agence/{agence_id}")
    AgenceDto getAgenceById(@PathVariable(name = "agence_id") Long agence_id);

    @GetMapping(path = "/user/offLine/getAllDelegations")
     List<DelegationDto> getAllDelegationOffLine();


    @GetMapping(path = "/user/offLine/getAllAgences")
     List<AgenceDto> allAgenceOfLine();


    @GetMapping(path = "/user/offLine/getAllPointVente")
    List<PointVenteDto> pointVenteOffline();

    @GetMapping(path = "/user/offLine/getAllPointVentes/{agence_id}")
     List<PointVenteDto> getAllPointVentes(@PathVariable(name = "agence_id") Long agence_id);

    @GetMapping(path = "/user/offLine/getAllDelegation/{delegationId}")
    DelegationDto getAllDelegationOffLineById(
            @PathVariable(name = "delegationId") Long delegationId);


    @GetMapping(path = "/user/offLine/getUserByUuid/{userUuid}")
     User getUserByUuid(@PathVariable("userUuid") String userUuid);


}