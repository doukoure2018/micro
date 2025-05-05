package io.digiservices.ebanking.utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class GenerateCode {

    public static String generateRandomString(int length) {
        int leftLimit = 97; // letter 'a'
        int rightLimit = 122; // letter 'z'
        Random random = new Random();
        StringBuilder buffer = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int randomLimitedInt = leftLimit + (int)
                    (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        String generatedString = buffer.toString();

        return generatedString;
    }


    public static String generateRandom6DigitString() {
        List<Integer> digits = new ArrayList<>();
        for (int i = 1; i < 10; i++) {
            digits.add(i);
        }

        Collections.shuffle(digits);

        StringBuilder randomStr = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            randomStr.append(digits.get(i));
        }

        return randomStr.toString();
    }
}
