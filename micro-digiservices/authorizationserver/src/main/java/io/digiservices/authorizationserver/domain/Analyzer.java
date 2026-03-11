package io.digiservices.authorizationserver.domain;

import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;

public class Analyzer {
    private static UserAgentAnalyzer INSTANCE;

    public static UserAgentAnalyzer getInstance() {
        if(INSTANCE == null) {
            INSTANCE = UserAgentAnalyzer
                    .newBuilder()
                    .hideMatcherLoadStats()
                    .withField(UserAgent.DEVICE_NAME)
                    .withField(UserAgent.AGENT_NAME)
                    .withCache(1000)
                    .build();
        }
        return INSTANCE;
    }
}
