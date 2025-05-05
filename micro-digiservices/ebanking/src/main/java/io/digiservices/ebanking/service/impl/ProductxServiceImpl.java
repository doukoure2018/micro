package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.service.ProductxService;
import io.digiservices.ebanking.repository.ProductxRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductxServiceImpl implements ProductxService {

    private ProductxRepository productxRepository;

    public ProductxServiceImpl(ProductxRepository productxRepository) {
        this.productxRepository = productxRepository;
    }


    @Override
    public List<Object[]> getInfoProducto(String codSystema) {
        List<Object[]> objects=productxRepository.getInfoProducto(codSystema);

        return objects.stream().toList();
    }
}
