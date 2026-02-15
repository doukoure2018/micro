package io.digiservices.ecreditservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

import java.util.HashMap;

import java.util.Map;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(
        basePackages = "io.digiservices.clients"
)
public class EcreditServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EcreditServiceApplication.class,args);
    }
}
