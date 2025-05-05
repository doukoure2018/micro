package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.ReqCreditoDto;

import java.util.List;

public interface ReqCreditoService {

    ReqCreditoDto createReqCredit (ReqCreditoDto reqCreditoDto);

    List<ReqCreditoDto> getAllReqCredito();
}
