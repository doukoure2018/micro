package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Producto;
import io.digiservices.ebanking.paylaod.ProductoDto;
import io.digiservices.ebanking.paylaod.ProductoPkId;
import io.digiservices.ebanking.repository.ProductoRepository;
import io.digiservices.ebanking.service.ProductoService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class ProductoServiceImpl implements ProductoService {

    private ProductoRepository productoRepository;
    private ModelMapper mapper;

    public ProductoServiceImpl(ProductoRepository productoRepository, ModelMapper mapper) {
        this.productoRepository = productoRepository;
        this.mapper = mapper;
    }

    @Override
    public ProductoDto getDescriptionProd(ProductoPkId productoPkId) {
        Producto producto=productoRepository.getReferenceById(productoPkId);
        return mapper.map(producto,ProductoDto.class);
    }
}
