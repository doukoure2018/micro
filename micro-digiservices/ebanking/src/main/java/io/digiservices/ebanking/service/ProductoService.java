package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.ProductoDto;
import io.digiservices.ebanking.paylaod.ProductoPkId;

public interface ProductoService {

    ProductoDto getDescriptionProd(ProductoPkId productoPkId);
}
