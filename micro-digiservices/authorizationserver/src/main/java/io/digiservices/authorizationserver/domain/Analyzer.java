package io.digiservices.authorizationserver.domain;

import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;

public class Analyzer {

    // Initialisation paresseuse thread-safe (class holder) : la construction de
    // UserAgentAnalyzer est tres couteuse (~500 Mo transitoires, plusieurs dizaines
    // de secondes). L'ancien getInstance() non synchronise laissait N threads HTTP
    // la lancer en parallele -> OutOfMemoryError en prod (2026-09-04).
    private static final class Holder {
        private static final UserAgentAnalyzer INSTANCE = UserAgentAnalyzer
                .newBuilder()
                .hideMatcherLoadStats()
                .withField(UserAgent.DEVICE_NAME)
                .withField(UserAgent.AGENT_NAME)
                .withCache(1000)
                .immediateInitialization()
                .build();
    }

    public static UserAgentAnalyzer getInstance() {
        return Holder.INSTANCE;
    }
}
