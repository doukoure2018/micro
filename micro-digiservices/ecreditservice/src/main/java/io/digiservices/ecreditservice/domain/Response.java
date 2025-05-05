package io.digiservices.ecreditservice.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import org.springframework.http.HttpStatus;

import java.util.Map;


@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record Response(String time, int code, String path, HttpStatus httpStatus, String message, String exception, Map<?, ?> data) {

}
