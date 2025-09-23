package io.digiservices.clients.config;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
public class CustomFeignErrorDecoder implements ErrorDecoder {

    @Override
    public Exception decode(String methodKey, Response response) {
        HttpStatus status = HttpStatus.resolve(response.status());

        if (status == null) {
            return new Exception("Unknown error occurred");
        }

        switch (status) {
            case NOT_FOUND:
                log.warn("Resource not found: {}", methodKey);
                return new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found");
            case BAD_REQUEST:
                log.warn("Bad request: {}", methodKey);
                return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request");
            case UNAUTHORIZED:
                log.error("Unauthorized access: {}", methodKey);
                return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
            case INTERNAL_SERVER_ERROR:
                log.error("Internal server error: {}", methodKey);
                return new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
            default:
                return new Exception("Generic error: " + response.status());
        }
    }
}