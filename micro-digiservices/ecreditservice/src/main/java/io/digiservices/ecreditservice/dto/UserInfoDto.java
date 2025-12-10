package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String imageUrl;
}
