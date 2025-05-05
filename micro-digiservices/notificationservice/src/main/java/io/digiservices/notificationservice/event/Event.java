package io.digiservices.notificationservice.event;


import io.digiservices.notificationservice.enumeration.EventType;
import lombok.*;

import java.util.Map;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Event {

    private EventType eventType;
    private Map<String, ?> data;
}
