package io.digiservices.ebanking.service;

import io.digiservices.ebanking.dto.DepositMobile;
import io.digiservices.ebanking.dto.DepositResponse;

public interface DepositMobileService {

    DepositResponse depositAccountMobile(DepositMobile depositMobile, String codCliente);
}

