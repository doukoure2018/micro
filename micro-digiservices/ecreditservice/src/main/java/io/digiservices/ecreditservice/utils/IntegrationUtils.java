package io.digiservices.ecreditservice.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Component
@Slf4j
public class IntegrationUtils {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final XmlMapper xmlMapper;

    // Configuration values - adjust based on your application.properties
    @Value("${integration.partner.base-url:http://197.149.247.18:7890}")
    private String baseUrl;

    @Value("${integration.partner.user:CRG01}")
    private String user;

    @Value("${integration.partner.password:CRG@12}")
    private String password;

    @Value("${integration.partner.version:0}")
    private int version;

    @Value("${integration.partner.hours:2}")
    private int hours;

    /**
     * -- GETTER --
     *  Get current stored token
     */
    // In-memory token storage
    @Getter
    private String currentToken;

    public IntegrationUtils(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
        this.xmlMapper = new XmlMapper();
    }

    /**
     * Call get_verify_code API to get token
     */
    public Map<String, Object> getVerifyCode() throws Exception {
        log.info("Calling get_verify_code API");

        String seed = generateSeed();
        String signature = generateGetVerifyCodeSignature(seed);

        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        requestBody.put("hours", hours);
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=&action=get_verify_code";

        log.info("Request URL: {}", url);
        log.info("Request Body: {}", objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Response Content-Type: {}", contentType);
            log.info("Raw Response: {}", responseBody);

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);
            log.info("Parsed Response: {}", objectMapper.writeValueAsString(parsedResponse));

            // Store token for later use
            if (parsedResponse != null && parsedResponse.containsKey("tokens")) {
                currentToken = (String) parsedResponse.get("tokens");
                log.info("Token stored: {}", currentToken);
            }

            return parsedResponse;

        } catch (Exception e) {
            log.error("Error calling get_verify_code API: ", e);
            throw new RuntimeException("Failed to get verify code: " + e.getMessage(), e);
        }
    }

    /**
     * Call accountdetail API using the stored token
     */
    public Map<String, Object> getAccountDetail() throws Exception {
        if (currentToken == null || currentToken.isEmpty()) {
            throw new RuntimeException("No token available. Please call getVerifyCode first.");
        }

        log.info("Calling accountdetail API with token: {}", currentToken);

        String seed = generateSeed();
        String signature = generateAccountDetailSignature(seed, currentToken);

        // Prepare request body (no hours for accountdetail)
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=&action=accountdetail";

        log.info("Request URL: {}", url);
        log.info("Request Body: {}", objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Response Content-Type: {}", contentType);
            log.info("Raw Response: {}", responseBody);

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);
            log.info("Parsed Response: {}", objectMapper.writeValueAsString(parsedResponse));

            return parsedResponse;

        } catch (Exception e) {
            log.error("Error calling accountdetail API: ", e);
            throw new RuntimeException("Failed to get account detail: " + e.getMessage(), e);
        }
    }


    /**
     * Call the customer details API with given parameters and better error handling
     */
    private Map<String, Object> callCustomerDetailsAPI(String seed, String customerReference, String signature, String approach) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        if (customerReference != null && !customerReference.isEmpty()) {
            requestBody.put("rst_value", customerReference);
        }
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=ppe&action=get_cst_details";

        log.info("Request URL ({}): {}", approach, url);
        log.info("Request Body ({}): {}", approach, objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            response.getHeaders().getContentType();
            String contentType = response.getHeaders().getContentType().toString();

            log.info("Response Status ({}): {}", approach, response.getStatusCode());
            log.info("Response Content-Type ({}): {}", approach, contentType);
            log.info("Raw Response ({}): {}", approach, responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received for approach: " + approach);
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);
            log.info("Parsed Response ({}): {}", approach, objectMapper.writeValueAsString(parsedResponse));

            return parsedResponse;

        } catch (Exception e) {
            log.error("HTTP/Parsing error for approach {}: {}", approach, e.getMessage(), e);
            throw new RuntimeException("API call failed for approach " + approach + ": " + e.getMessage(), e);
        }
    }

    /**
     * Call get_cst_details API to get customer details with better error handling
     */
    public Map<String, Object> getCustomerDetails(String customerReference) throws Exception {
        log.info("Calling get_cst_details API for customer: {}", customerReference);

        // Ensure we have a token first (since accountdetail works with token)
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available for customer details, getting token first...");
            getVerifyCode(); // This will store the token
        }

        String seed = generateSeed();
        Map<String, String> errors = new HashMap<>();

        // IMPORTANT: Add approach5_with_token to the array
        String[] approaches = {"approach1", "approach2", "approach3", "approach4", "approach5_with_token"};

        for (String approach : approaches) {
            try {
                log.info("Trying signature approach: {}", approach);
                String signature = generateCustomerDetailsSignatureByApproach(seed, customerReference, approach);

                Map<String, Object> response = callCustomerDetailsAPI(seed, customerReference, signature, approach);

                // Check if response is successful (state = 0)
                Object state = response.get("state");
                log.info("Response state for {}: {}", approach, state);

                if (state != null && (state.equals(0) || state.equals("0"))) {
                    log.info("SUCCESS with approach: {} - Signature: {}", approach, signature);
                    return response;
                } else {
                    String errorMsg = String.format("State: %s, Message: %s", state, response.get("message"));
                    errors.put(approach, errorMsg);
                    log.warn("Failed with approach: {} - {}", approach, errorMsg);
                }

            } catch (Exception e) {
                String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
                errors.put(approach, errorMsg);
                log.error("Error with approach: {} - {}", approach, errorMsg, e);
            }
        }

        // If all approaches failed, provide detailed error information
        StringBuilder errorDetails = new StringBuilder("All signature approaches failed for get_cst_details:\n");
        for (Map.Entry<String, String> entry : errors.entrySet()) {
            errorDetails.append(String.format("- %s: %s\n", entry.getKey(), entry.getValue()));
        }

        log.error("All approaches failed. Details: {}", errorDetails.toString());
        throw new RuntimeException(errorDetails.toString());
    }

    /**
     * Generate signature using different approaches for get_cst_details
     */
    private String generateCustomerDetailsSignatureByApproach(String seed, String customerReference, String approach) throws Exception {
        log.debug("Generating signature for get_cst_details using approach: {}", approach);

        // Step 2: Pass = HmacSHA256(password, password) - same for all approaches
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        String stringA;
        String valueInput;

        switch (approach) {
            case "approach1":
                // Original approach: similar to get_verify_code
                if (customerReference != null && !customerReference.isEmpty()) {
                    stringA = String.format("rst_value=%s&seed=%s&user=%s&version=%d",
                            customerReference, seed, user, version);
                } else {
                    stringA = String.format("seed=%s&user=%s&version=%d", seed, user, version);
                }
                valueInput = user + pass; // No token
                break;

            case "approach2":
                // Include rst_value in value calculation
                if (customerReference != null && !customerReference.isEmpty()) {
                    stringA = String.format("rst_value=%s&seed=%s&user=%s&version=%d",
                            customerReference, seed, user, version);
                    valueInput = user + pass + customerReference; // Include rst_value
                } else {
                    stringA = String.format("seed=%s&user=%s&version=%d", seed, user, version);
                    valueInput = user + pass; // No rst_value
                }
                break;

            case "approach3":
                // Different parameter order in stringA (alphabetical)
                if (customerReference != null && !customerReference.isEmpty()) {
                    stringA = String.format("rst_value=%s&seed=%s&user=%s&version=%d",
                            customerReference, seed, user, version);
                } else {
                    stringA = String.format("seed=%s&user=%s&version=%d", seed, user, version);
                }
                valueInput = user + pass; // No token
                break;

            case "approach4":
                // Try without rst_value in stringA even if provided, similar to accountdetail
                stringA = String.format("seed=%s&user=%s&version=%d", seed, user, version);
                if (customerReference != null && !customerReference.isEmpty()) {
                    valueInput = user + pass + customerReference; // Include rst_value in value
                } else {
                    valueInput = user + pass;
                }
                break;
            case "approach5_with_token":
                // NEW: Use token like accountdetail (since accountdetail works perfectly)
                if (customerReference != null && !customerReference.isEmpty()) {
                    stringA = String.format("rst_value=%s&seed=%s&user=%s&version=%d",
                            customerReference, seed, user, version);
                } else {
                    stringA = String.format("seed=%s&user=%s&version=%d", seed, user, version);
                }
                // SAME AS ACCOUNTDETAIL: user + pass + token
                valueInput = user + pass + (currentToken != null ? currentToken : "");
                log.debug("Using token for approach5_with_token: {}", currentToken != null ? currentToken : "NO_TOKEN");
                break;

            default:
                throw new IllegalArgumentException("Unknown approach: " + approach);
        }

        log.debug("StringA ({}): {}", approach, stringA);
        log.debug("ValueInput ({}): {}", approach, valueInput);

        // Rest of the algorithm is the same
        String value = calculateMd5(valueInput);
        log.debug("Value ({}): {}", approach, value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Key ({}): {}", approach, key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("StringSignTemp ({}): {}", approach, stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Final signature ({}): {}", approach, signature);

        return signature;
    }

    /**
     * Generate signature for get_verify_code API
     */
    private String generateGetVerifyCodeSignature(String seed) throws Exception {
        log.debug("Generating signature for get_verify_code");

        // Step 1: StringA WITH hours
        String stringA = String.format("hours=%d&seed=%s&user=%s&version=%d", hours, seed, user, version);
        log.debug("StringA: {}", stringA);

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // Step 3: Value = md5(user + pass) - NO token for get_verify_code empty
        String valueInput = user + pass;
        String value = calculateMd5(valueInput);
        log.debug("Value: {}", value);

        // Step 4: Key = md5(value + seed)
        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Key: {}", key);

        // Step 5: StringSignTemp
        String stringSignTemp = stringA + "&key=" + key;
        log.debug("StringSignTemp: {}", stringSignTemp);

        // Step 6: Final signature
        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Final signature: {}", signature);

        return signature;
    }


    /**
     * Generate signature for accountdetail API
     */
    private String generateAccountDetailSignature(String seed, String token) throws Exception {
        log.debug("Generating signature for accountdetail");

        // Step 1: StringA WITHOUT hours
        String stringA = String.format("seed=%s&user=%s&version=%d", seed, user, version);
        log.debug("StringA: {}", stringA);

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // Step 3: Value = md5(user + pass + token) - WITH token for accountdetail
        String valueInput = user + pass + token;
        String value = calculateMd5(valueInput);
        log.debug("Value: {}", value);

        // Step 4: Key = md5(value + seed)
        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Key: {}", key);

        // Step 5: StringSignTemp
        String stringSignTemp = stringA + "&key=" + key;
        log.debug("StringSignTemp: {}", stringSignTemp);

        // Step 6: Final signature
        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Final signature: {}", signature);

        return signature;
    }


    /**
     * Call transfer_amt API to transfer amount to sub-agency or point of sales
     */
    public Map<String, Object> transferAmount(String transactionId, String recipientCode, String amount) throws Exception {
        log.info("Calling transfer_amt API - TransID: {}, Recipient: {}, Amount: {}", transactionId, recipientCode, amount);

        // Check if we have a token, if not get one first
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available for transfer, getting token first...");
            getVerifyCode(); // This will store the token
        }

        String seed = generateSeed();

        // Based on documentation, trans_id might need to be empty for transfers
        String transIdToUse = ""; // Try empty first as shown in successful example

        try {
            // First attempt with empty trans_id (like the successful example)
            log.info("Attempting transfer with empty trans_id (as per documentation example)");
            String signature = generateTransferSignature(seed, transIdToUse, recipientCode, amount);

            Map<String, Object> response = callTransferAPI(seed, transIdToUse, recipientCode, amount, signature, "empty_trans_id");

            Object state = response.get("state");
            if (state != null && (state.equals(0) || state.equals("0"))) {
                log.info("Transfer successful with empty trans_id!");
                return response;
            }

            // If failed, try with actual transaction ID
            if (transactionId != null && !transactionId.isEmpty()) {
                log.info("First attempt failed, trying with actual trans_id: {}", transactionId);
                signature = generateTransferSignature(seed, transactionId, recipientCode, amount);
                response = callTransferAPI(seed, transactionId, recipientCode, amount, signature, "with_trans_id");

                state = response.get("state");
                if (state != null && (state.equals(0) || state.equals("0"))) {
                    log.info("Transfer successful with transaction ID!");
                    return response;
                }
            }

            // If still failed, return the error
            String errorMsg = String.format("Transfer failed - State: %s, Message: %s",
                    response.get("state"), response.get("message"));
            throw new RuntimeException(errorMsg);

        } catch (Exception e) {
            log.error("Error in transfer amount: ", e);
            throw e;
        }
    }


    /**
     * Generate signature for transfer_amt API using the working approach
     */
    private String generateTransferSignature(String seed, String transactionId, String recipientCode,
                                             String amount) throws Exception {
        log.debug("Generating transfer signature");

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // Ensure parameters are not null
        String transId = (transactionId != null) ? transactionId : "";
        String rstValue = (recipientCode != null) ? recipientCode : "";

        // Based on the successful example and the permission error with token approach,
        // let's use the exact order from documentation
        String stringA = String.format("amt=%s&rst_value=%s&seed=%s&trans_id=%s&user=%s&version=%d",
                amount, rstValue, seed, transId, user, version);

        // Try with token first (since transfer_with_token_1 got permission error, not sign error)
        String valueInput = user + pass + (currentToken != null ? currentToken : "");

        log.debug("Transfer StringA: {}", stringA);
        log.debug("Transfer ValueInput: {}", valueInput);
        log.debug("Current Token: {}", currentToken != null ? currentToken : "NO_TOKEN");

        // Rest of the algorithm
        String value = calculateMd5(valueInput);
        log.debug("Transfer Value: {}", value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Transfer Key: {}", key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("Transfer StringSignTemp: {}", stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Transfer Final signature: {}", signature);

        return signature;
    }

    /**
     * Enhanced call transfer API method with better error handling
     */
    private Map<String, Object> callTransferAPI(String seed, String transactionId, String recipientCode,
                                                String amount, String signature, String approach) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        requestBody.put("trans_id", transactionId); // Can be empty string
        requestBody.put("rst_value", recipientCode);
        requestBody.put("amt", amount);
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=&action=transfer_amt";

        log.info("Transfer Request URL ({}): {}", approach, url);
        log.info("Transfer Request Body ({}): {}", approach, objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Transfer Response Status ({}): {}", approach, response.getStatusCode());
            log.info("Transfer Response Content-Type ({}): {}", approach, contentType);
            log.info("Transfer Raw Response ({}): {}", approach, responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received for transfer approach: " + approach);
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);
            log.info("Transfer Parsed Response ({}): {}", approach, objectMapper.writeValueAsString(parsedResponse));

            // Check for specific error codes
            Object state = parsedResponse.get("state");
            if (state != null) {
                int stateCode = Integer.parseInt(state.toString());
                if (stateCode == -95081) {
                    log.error("Permission denied for transfer. User {} may not have transfer privileges", user);
                    parsedResponse.put("permission_hint", "User may need transfer permissions or correct recipient code format");
                } else if (stateCode == -95211) {
                    log.error("Signature error for transfer");
                    parsedResponse.put("signature_hint", "Check signature calculation");
                }
            }

            return parsedResponse;

        } catch (Exception e) {
            log.error("Transfer HTTP/Parsing error for approach {}: {}", approach, e.getMessage(), e);
            throw new RuntimeException("Transfer API call failed for approach " + approach + ": " + e.getMessage(), e);
        }
    }

    // Add a helper method to validate recipient code
    public boolean isValidRecipientCode(String recipientCode) {
        if (recipientCode == null || recipientCode.isEmpty()) {
            return false;
        }
        // Based on example, it could be a phone number or user code
        // Adjust validation based on your requirements
        return recipientCode.length() >= 4;
    }


    /**
     * Call sale API for power payment (Pre-sale or Complete sale)
     * @param transactionId Transaction ID
     * @param deviceNumber Device number or reference (rst_code)
     * @param amount Sales amount
     * @param phoneNumber Customer phone number
     * @param channel Vending channel (01:USSD, 02:SMS, 03:APP, 04:Vending Client, 05:Web Site)
     * @param verifyCode Empty for pre-sale, "DONOTVERIFYDATA" for one-step, or verify code from pre-sale
     * @return Sale response including tokens if successful
     */
    public Map<String, Object> salePower(String transactionId, String deviceNumber, String amount,
                                         String phoneNumber, String channel, String verifyCode) throws Exception {
        log.info("Calling sale API - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}, VerifyCode: {}",
                transactionId, deviceNumber, amount, phoneNumber, channel,
                verifyCode != null && !verifyCode.isEmpty() ? "PROVIDED" : "EMPTY");

        // Ensure we have a token first
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available for sale, getting token first...");
            getVerifyCode(); // This will store the token
        }

        String seed = generateSeed();

        try {
            // First, let's verify the customer exists
            log.info("Verifying customer details for device: {}", deviceNumber);
            try {
                Map<String, Object> customerDetails = getCustomerDetails(deviceNumber);
                log.info("Customer found: {}", customerDetails.get("name"));
            } catch (Exception e) {
                log.warn("Could not verify customer details: {}", e.getMessage());
                // Continue anyway, the sale API will validate
            }

            // Use the working approach (approach 8 with token)
            log.info("Using proven signature approach with token");
            String signature = generateSaleSignatureWithToken(seed, transactionId, deviceNumber,
                    amount, phoneNumber, channel, verifyCode);

            Map<String, Object> response = callSaleAPI(seed, transactionId, deviceNumber,
                    amount, phoneNumber, channel, verifyCode, signature, "sale_with_token");

            // Check if response is successful (state = 0)
            Object state = response.get("state");
            log.info("Sale response state: {}", state);

            if (state != null && (state.equals(0) || state.equals("0"))) {
                log.info("Sale successful!");
                return response;
            } else if (state != null && (state.equals(-10006) || state.equals("-10006"))) {
                // Subscriber not found error
                String message = (String) response.get("message");
                throw new RuntimeException("Subscriber not found for device " + deviceNumber + ": " + message +
                        ". Please verify the device number is correct and active.");
            } else {
                // Other errors
                String errorMsg = String.format("Sale failed - State: %s, Message: %s", state, response.get("message"));
                log.error(errorMsg);
                throw new RuntimeException(errorMsg);
            }

        } catch (Exception e) {
            log.error("Error in sale power: ", e);
            throw e;
        }
    }

    /**
     * Generate signature using different approaches for sale API
     */
    private String generateSaleSignatureWithToken(String seed, String transactionId, String deviceNumber,
                                                  String amount, String phoneNumber, String channel,
                                                  String verifyCode) throws Exception {
        log.debug("Generating sale signature with token approach");

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        String calcMode = "M"; // Fixed as per documentation

        // Ensure parameters are not null
        String transId = (transactionId != null && !transactionId.isEmpty()) ? transactionId : "";
        String rstCode = (deviceNumber != null && !deviceNumber.isEmpty()) ? deviceNumber : "";
        String phone = (phoneNumber != null && !phoneNumber.isEmpty()) ? phoneNumber : "";
        String vCode = (verifyCode != null) ? verifyCode : "";
        String chan = (channel != null && !channel.isEmpty()) ? channel : "05";

        // StringA with all parameters in alphabetical order
        String stringA = String.format("amt=%s&calc_mode=%s&channel=%s&phone=%s&rst_code=%s&seed=%s&trans_id=%s&user=%s&verify_code=%s&version=%d",
                amount, calcMode, chan, phone, rstCode, seed, transId, user, vCode, version);

        // Value calculation WITH TOKEN (this is what works!)
        String valueInput = user + pass + (currentToken != null ? currentToken : "");

        log.debug("Sale StringA: {}", stringA);
        log.debug("Sale ValueInput: {}", valueInput);
        log.debug("Current Token: {}", currentToken != null ? currentToken : "NO_TOKEN");

        // Rest of the algorithm
        String value = calculateMd5(valueInput);
        log.debug("Sale Value: {}", value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Sale Key: {}", key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("Sale StringSignTemp: {}", stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Sale Final signature: {}", signature);

        return signature;
    }

    // Add a helper method to validate device number format
    public boolean isValidDeviceNumber(String deviceNumber) {
        if (deviceNumber == null || deviceNumber.isEmpty()) {
            return false;
        }
        // Check if it's numeric and has reasonable length (adjust based on your requirements)
        return deviceNumber.matches("\\d{8,15}");
    }

    // Add method to pre-validate sale request
    public Map<String, Object> validateAndSalePower(String transactionId, String deviceNumber, String amount,
                                                    String phoneNumber, String channel, String verifyCode) throws Exception {
        // Validate device number format
        if (!isValidDeviceNumber(deviceNumber)) {
            throw new IllegalArgumentException("Invalid device number format: " + deviceNumber);
        }

        // Validate amount
        try {
            double amountValue = Double.parseDouble(amount);
            if (amountValue <= 0) {
                throw new IllegalArgumentException("Amount must be positive");
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid amount format: " + amount);
        }

        // Validate phone number (basic check)
        if (phoneNumber == null || phoneNumber.length() < 8) {
            throw new IllegalArgumentException("Invalid phone number: " + phoneNumber);
        }

        // Proceed with sale
        return salePower(transactionId, deviceNumber, amount, phoneNumber, channel, verifyCode);
    }


    /**
     * Call the sale API with given parameters
     */
    private Map<String, Object> callSaleAPI(String seed, String transactionId, String deviceNumber,
                                            String amount, String phoneNumber, String channel,
                                            String verifyCode, String signature, String approach) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        requestBody.put("trans_id", transactionId != null ? transactionId : "");
        requestBody.put("rst_code", deviceNumber != null ? deviceNumber : "");
        requestBody.put("calc_mode", "M");
        requestBody.put("amt", amount);
        requestBody.put("channel", channel != null ? channel : "05");
        requestBody.put("phone", phoneNumber); // Changed from "Phone" to "phone" - lowercase
        requestBody.put("verify_code", verifyCode != null ? verifyCode : "");
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=ppe&action=sale";

        log.info("Sale Request URL ({}): {}", approach, url);
        log.info("Sale Request Body ({}): {}", approach, objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Sale Response Status ({}): {}", approach, response.getStatusCode());
            log.info("Sale Response Content-Type ({}): {}", approach, contentType);
            log.info("Sale Raw Response ({}): {}", approach, responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received for sale approach: " + approach);
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);

            // Parse complex sale response fields if present
            if (parsedResponse.containsKey("sale_details")) {
                parsedResponse.put("sale_details", parseSaleDetails(parsedResponse.get("sale_details")));
            }
            if (parsedResponse.containsKey("fee_details")) {
                parsedResponse.put("fee_details", parseFeeDetails(parsedResponse.get("fee_details")));
            }
            if (parsedResponse.containsKey("arrear_details")) {
                parsedResponse.put("arrear_details", parseArrearDetails(parsedResponse.get("arrear_details")));
            }

            log.info("Sale Parsed Response ({}): {}", approach, objectMapper.writeValueAsString(parsedResponse));

            return parsedResponse;

        } catch (Exception e) {
            log.error("Sale HTTP/Parsing error for approach {}: {}", approach, e.getMessage(), e);
            throw new RuntimeException("Sale API call failed for approach " + approach + ": " + e.getMessage(), e);
        }
    }


    /**
     * Call sales_trans_details API to get details of a specific sales transaction
     * @param transactionCode The transaction code from a previous sale
     * @return Transaction details
     */
    public Map<String, Object> getSalesTransactionDetails(String transactionCode) throws Exception {
        log.info("Calling sales_trans_details API for transaction code: {}", transactionCode);

        // Ensure we have a token first
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available, getting token first...");
            getVerifyCode();
        }

        String seed = generateSeed();

        try {
            // Generate signature for sales_trans_details
            String signature = generateSalesTransDetailsSignature(seed, transactionCode);

            Map<String, Object> response = callSalesTransDetailsAPI(seed, transactionCode, signature);

            // Check if response is successful (state = 0)
            Object state = response.get("state");
            log.info("Sales trans details response state: {}", state);

            if (state != null && (state.equals(0) || state.equals("0"))) {
                log.info("Successfully retrieved transaction details for code: {}", transactionCode);
                return response;
            } else {
                String errorMsg = String.format("Failed to get transaction details - State: %s, Message: %s",
                        state, response.get("message"));

                if (state != null && (state.equals(-95035) || state.equals("-95035"))) {
                    throw new RuntimeException("Transaction not found: " + transactionCode);
                }

                throw new RuntimeException(errorMsg);
            }

        } catch (Exception e) {
            log.error("Error getting sales transaction details: ", e);
            throw e;
        }
    }

    /**
     * Call the sales_trans_details API
     */
    private Map<String, Object> callSalesTransDetailsAPI(String seed, String transactionCode, String signature) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        requestBody.put("code", transactionCode);
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=ppe&action=sales_trans_details";

        log.info("Sales Trans Details Request URL: {}", url);
        log.info("Sales Trans Details Request Body: {}", objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Sales Trans Details Response Status: {}", response.getStatusCode());
            log.info("Sales Trans Details Raw Response: {}", responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received");
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);

            // Parse complex fields if present (same as sale response)
            if (parsedResponse.containsKey("sale_details")) {
                parsedResponse.put("sale_details", parseSaleDetails(parsedResponse.get("sale_details")));
            }
            if (parsedResponse.containsKey("fee_details")) {
                parsedResponse.put("fee_details", parseFeeDetails(parsedResponse.get("fee_details")));
            }
            if (parsedResponse.containsKey("arrear_details")) {
                parsedResponse.put("arrear_details", parseArrearDetails(parsedResponse.get("arrear_details")));
            }

            return parsedResponse;

        } catch (Exception e) {
            log.error("HTTP/Parsing error for sales_trans_details: {}", e.getMessage(), e);
            throw new RuntimeException("Sales trans details API call failed: " + e.getMessage(), e);
        }
    }

    /**
     * Generate signature for sales_trans_details API
     */
    private String generateSalesTransDetailsSignature(String seed, String transactionCode) throws Exception {
        log.debug("Generating signature for sales_trans_details");

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // StringA with parameters in alphabetical order
        String stringA = String.format("code=%s&seed=%s&user=%s&version=%d",
                transactionCode, seed, user, version);

        // Value calculation with token (based on working patterns)
        String valueInput = user + pass + (currentToken != null ? currentToken : "");

        log.debug("Sales Trans Details StringA: {}", stringA);
        log.debug("Sales Trans Details ValueInput: {}", valueInput);

        // Rest of the algorithm
        String value = calculateMd5(valueInput);
        log.debug("Value: {}", value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Key: {}", key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("StringSignTemp: {}", stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Final signature: {}", signature);

        return signature;
    }


    /**
     * Call search_sale_trans API to search for sales transactions
     * @param deviceNumber Device number or customer reference (rst_code)
     * @param count Number of records to return (default 10)
     * @return List of transactions
     */
    public Map<String, Object> searchSalesTransactions(String deviceNumber, Integer count) throws Exception {
        log.info("Calling search_sale_trans API for device: {}, count: {}", deviceNumber, count);

        // Ensure we have a token first
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available, getting token first...");
            getVerifyCode();
        }

        String seed = generateSeed();
        int recordCount = (count != null && count > 0) ? count : 10; // Default to 10 records

        try {
            // Generate signature for search_sale_trans
            String signature = generateSearchSaleTransSignature(seed, deviceNumber, recordCount);

            Map<String, Object> response = callSearchSaleTransAPI(seed, deviceNumber, recordCount, signature);

            // Check if response is successful (state = 0)
            Object state = response.get("state");
            log.info("Search sale trans response state: {}", state);

            if (state != null && (state.equals(0) || state.equals("0"))) {
                log.info("Successfully found transactions for device: {}", deviceNumber);
                return response;
            } else {
                String errorMsg = String.format("Failed to search transactions - State: %s, Message: %s",
                        state, response.get("message"));

                if (state != null && (state.equals(-95035) || state.equals("-95035"))) {
                    throw new RuntimeException("No transactions found for device: " + deviceNumber);
                }

                throw new RuntimeException(errorMsg);
            }

        } catch (Exception e) {
            log.error("Error searching sales transactions: ", e);
            throw e;
        }
    }

    /**
     * Generate signature for search_sale_trans API
     */
    private String generateSearchSaleTransSignature(String seed, String deviceNumber, int count) throws Exception {
        log.debug("Generating signature for search_sale_trans");

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // StringA with parameters in alphabetical order
        String stringA = String.format("count=%d&rst_code=%s&seed=%s&user=%s&version=%d",
                count, deviceNumber, seed, user, version);

        // Value calculation with token (based on working patterns)
        String valueInput = user + pass + (currentToken != null ? currentToken : "");

        log.debug("Search Sale Trans StringA: {}", stringA);
        log.debug("Search Sale Trans ValueInput: {}", valueInput);

        // Rest of the algorithm
        String value = calculateMd5(valueInput);
        log.debug("Value: {}", value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Key: {}", key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("StringSignTemp: {}", stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Final signature: {}", signature);

        return signature;
    }

    /**
     * Call the search_sale_trans API
     */
    private Map<String, Object> callSearchSaleTransAPI(String seed, String deviceNumber, int count, String signature) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        requestBody.put("rst_code", deviceNumber);
        requestBody.put("count", count);
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=ppe&action=search_sale_trans";

        log.info("Search Sale Trans Request URL: {}", url);
        log.info("Search Sale Trans Request Body: {}", objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Search Sale Trans Response Status: {}", response.getStatusCode());
            log.info("Search Sale Trans Raw Response: {}", responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received");
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);

            // Parse details array if present
            if (parsedResponse.containsKey("details")) {
                Object details = parsedResponse.get("details");
                if (details instanceof String) {
                    try {
                        parsedResponse.put("details", objectMapper.readValue((String) details, List.class));
                    } catch (Exception e) {
                        log.debug("Could not parse details as JSON, returning as-is");
                    }
                }
            }

            return parsedResponse;

        } catch (Exception e) {
            log.error("HTTP/Parsing error for search_sale_trans: {}", e.getMessage(), e);
            throw new RuntimeException("Search sale trans API call failed: " + e.getMessage(), e);
        }
    }


    /**
     * Call payarrear API to pay arrears (Pre-pay or Complete payment)
     * @param transactionId Transaction ID
     * @param deviceNumber Device number or reference (rst_code)
     * @param amount Payment amount
     * @param phoneNumber Customer phone number
     * @param channel Vending channel (01:USSD, 02:SMS, 03:APP, 04:Vending Client, 05:Web Site)
     * @param verifyCode Empty for pre-pay, "DONOTVERIFYDATA" for one-step, or verify code from pre-pay
     * @return Payment response
     */
    public Map<String, Object> payArrear(String transactionId, String deviceNumber, String amount,
                                         String phoneNumber, String channel, String verifyCode) throws Exception {
        log.info("Calling payarrear API - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}, VerifyCode: {}",
                transactionId, deviceNumber, amount, phoneNumber, channel,
                verifyCode != null && !verifyCode.isEmpty() ? "PROVIDED" : "EMPTY");

        // Ensure we have a token first
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available for pay arrear, getting token first...");
            getVerifyCode(); // This will store the token
        }

        String seed = generateSeed();

        try {
            // Use the same signature approach as the working sale API (with token)
            log.info("Using proven signature approach with token for pay arrear");
            String signature = generatePayArrearSignature(seed, transactionId, deviceNumber,
                    amount, phoneNumber, channel, verifyCode);

            Map<String, Object> response = callPayArrearAPI(seed, transactionId, deviceNumber,
                    amount, phoneNumber, channel, verifyCode, signature);

            // Check if response is successful (state = 0)
            Object state = response.get("state");
            log.info("Pay arrear response state: {}", state);

            if (state != null && (state.equals(0) || state.equals("0"))) {
                log.info("Pay arrear successful!");
                return response;
            } else if (state != null && (state.equals(-10006) || state.equals("-10006"))) {
                // Customer not found error
                String message = (String) response.get("message");
                throw new RuntimeException("Customer not found for device " + deviceNumber + ": " + message +
                        ". Please verify the device number is correct and has arrears.");
            } else if (state != null && (state.equals(-10020) || state.equals("-10020"))) {
                // Minimum amount error
                String minAmt = response.get("min_amt") != null ? response.get("min_amt").toString() : "unknown";
                throw new RuntimeException("Amount too low. Minimum payment amount required: " + minAmt);
            } else {
                // Other errors
                String errorMsg = String.format("Pay arrear failed - State: %s, Message: %s", state, response.get("message"));
                log.error(errorMsg);
                throw new RuntimeException(errorMsg);
            }

        } catch (Exception e) {
            log.error("Error in pay arrear: ", e);
            throw e;
        }
    }

    /**
     * Generate signature for payarrear API using the working approach (with token)
     */
    private String generatePayArrearSignature(String seed, String transactionId, String deviceNumber,
                                              String amount, String phoneNumber, String channel,
                                              String verifyCode) throws Exception {
        log.debug("Generating pay arrear signature with token approach");

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // Ensure parameters are not null
        String transId = (transactionId != null && !transactionId.isEmpty()) ? transactionId : "";
        String rstCode = (deviceNumber != null && !deviceNumber.isEmpty()) ? deviceNumber : "";
        String phone = (phoneNumber != null && !phoneNumber.isEmpty()) ? phoneNumber : "";
        String vCode = (verifyCode != null) ? verifyCode : "";
        String chan = (channel != null && !channel.isEmpty()) ? channel : "05";

        // StringA with all parameters in alphabetical order (same as sale API)
        String stringA = String.format("amt=%s&channel=%s&phone=%s&rst_code=%s&seed=%s&trans_id=%s&user=%s&verify_code=%s&version=%d",
                amount, chan, phone, rstCode, seed, transId, user, vCode, version);

        // Value calculation WITH TOKEN (same as working sale API)
        String valueInput = user + pass + (currentToken != null ? currentToken : "");

        log.debug("Pay Arrear StringA: {}", stringA);
        log.debug("Pay Arrear ValueInput: {}", valueInput);
        log.debug("Current Token: {}", currentToken != null ? currentToken : "NO_TOKEN");

        // Rest of the algorithm
        String value = calculateMd5(valueInput);
        log.debug("Pay Arrear Value: {}", value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Pay Arrear Key: {}", key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("Pay Arrear StringSignTemp: {}", stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Pay Arrear Final signature: {}", signature);

        return signature;
    }

    /**
     * Call the payarrear API with given parameters
     */
    private Map<String, Object> callPayArrearAPI(String seed, String transactionId, String deviceNumber,
                                                 String amount, String phoneNumber, String channel,
                                                 String verifyCode, String signature) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        requestBody.put("trans_id", transactionId);
        requestBody.put("rst_code", deviceNumber);
        requestBody.put("amt", amount);
        requestBody.put("channel", channel);
        requestBody.put("phone", phoneNumber); // lowercase as per working sale API
        requestBody.put("verify_code", verifyCode != null ? verifyCode : "");
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=ppe&action=payarrear";

        log.info("Pay Arrear Request URL: {}", url);
        log.info("Pay Arrear Request Body: {}", objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Pay Arrear Response Status: {}", response.getStatusCode());
            log.info("Pay Arrear Response Content-Type: {}", contentType);
            log.info("Pay Arrear Raw Response: {}", responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received for pay arrear");
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);

            // Parse pay_details if present
            if (parsedResponse.containsKey("pay_details")) {
                parsedResponse.put("pay_details", parsePayDetails(parsedResponse.get("pay_details")));
            }

            log.info("Pay Arrear Parsed Response: {}", objectMapper.writeValueAsString(parsedResponse));

            return parsedResponse;

        } catch (Exception e) {
            log.error("Pay Arrear HTTP/Parsing error: {}", e.getMessage(), e);
            throw new RuntimeException("Pay arrear API call failed: " + e.getMessage(), e);
        }
    }

    /**
     * Helper method to parse pay details
     */
    private Object parsePayDetails(Object payDetails) {
        if (payDetails instanceof String) {
            try {
                return objectMapper.readValue((String) payDetails, List.class);
            } catch (Exception e) {
                log.debug("Could not parse pay_details as JSON, returning as-is");
                return payDetails;
            }
        }
        return payDetails;
    }

    /**
     * Check if customer has arrears
     */
    public Map<String, Object> checkArrears(String deviceNumber) throws Exception {
        log.info("Checking arrears for device: {}", deviceNumber);

        try {
            // Get customer details which should include arrear information
            Map<String, Object> customerDetails = getCustomerDetails(deviceNumber);

            Map<String, Object> arrearInfo = new HashMap<>();
            arrearInfo.put("device", deviceNumber);
            arrearInfo.put("name", customerDetails.get("name"));
            arrearInfo.put("ref_code", customerDetails.get("ref_code"));

            // Check if there's arrear information in the response
            boolean hasArrears = false;
            Double totalArrears = 0.0;

            // The customer details response might have arrear information
            // You may need to adjust this based on actual response structure
            if (customerDetails.containsKey("arrear_amt")) {
                String arrearAmt = customerDetails.get("arrear_amt").toString();
                try {
                    totalArrears = Double.parseDouble(arrearAmt);
                    hasArrears = totalArrears > 0;
                } catch (NumberFormatException e) {
                    log.warn("Could not parse arrear amount: {}", arrearAmt);
                }
            }

            arrearInfo.put("has_arrears", hasArrears);
            arrearInfo.put("total_arrears", totalArrears);

            return arrearInfo;

        } catch (Exception e) {
            log.error("Error checking arrears: ", e);
            throw new RuntimeException("Failed to check arrears: " + e.getMessage(), e);
        }
    }




    /**
     * Call arrear_trans_details API to get details of a specific arrear payment transaction
     * @param transactionCode The transaction code from an arrear payment
     * @return Transaction details
     */
    public Map<String, Object> getArrearTransactionDetails(String transactionCode) throws Exception {
        log.info("Calling arrear_trans_details API for transaction code: {}", transactionCode);

        // Ensure we have a token first
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available, getting token first...");
            getVerifyCode();
        }

        String seed = generateSeed();

        try {
            // Generate signature for arrear_trans_details
            String signature = generateArrearTransDetailsSignature(seed, transactionCode);

            Map<String, Object> response = callArrearTransDetailsAPI(seed, transactionCode, signature);

            // Check if response is successful (state = 0)
            Object state = response.get("state");
            log.info("Arrear trans details response state: {}", state);

            if (state != null && (state.equals(0) || state.equals("0"))) {
                log.info("Successfully retrieved arrear transaction details for code: {}", transactionCode);
                return response;
            } else {
                String errorMsg = String.format("Failed to get arrear transaction details - State: %s, Message: %s",
                        state, response.get("message"));

                if (state != null && (state.equals(-95035) || state.equals("-95035"))) {
                    throw new RuntimeException("Arrear transaction not found: " + transactionCode);
                }

                throw new RuntimeException(errorMsg);
            }

        } catch (Exception e) {
            log.error("Error getting arrear transaction details: ", e);
            throw e;
        }
    }

    /**
     * Generate signature for arrear_trans_details API
     */
    private String generateArrearTransDetailsSignature(String seed, String transactionCode) throws Exception {
        log.debug("Generating signature for arrear_trans_details");

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // StringA with parameters in alphabetical order
        String stringA = String.format("seed=%s&trans_code=%s&user=%s&version=%d",
                seed, transactionCode, user, version);

        // Value calculation with token (based on working patterns)
        String valueInput = user + pass + (currentToken != null ? currentToken : "");

        log.debug("Arrear Trans Details StringA: {}", stringA);
        log.debug("Arrear Trans Details ValueInput: {}", valueInput);

        // Rest of the algorithm
        String value = calculateMd5(valueInput);
        log.debug("Value: {}", value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Key: {}", key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("StringSignTemp: {}", stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Final signature: {}", signature);

        return signature;
    }

    /**
     * Call the arrear_trans_details API
     */
    private Map<String, Object> callArrearTransDetailsAPI(String seed, String transactionCode, String signature) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        requestBody.put("trans_code", transactionCode);
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=ppe&action=arrear_trans_details";

        log.info("Arrear Trans Details Request URL: {}", url);
        log.info("Arrear Trans Details Request Body: {}", objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Arrear Trans Details Response Status: {}", response.getStatusCode());
            log.info("Arrear Trans Details Raw Response: {}", responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received");
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);

            // Parse pay_details if present (same as payarrear response)
            if (parsedResponse.containsKey("pay_details")) {
                parsedResponse.put("pay_details", parsePayDetails(parsedResponse.get("pay_details")));
            }

            return parsedResponse;

        } catch (Exception e) {
            log.error("HTTP/Parsing error for arrear_trans_details: {}", e.getMessage(), e);
            throw new RuntimeException("Arrear trans details API call failed: " + e.getMessage(), e);
        }
    }

    /**
     * Call search_arrear_trans API to search for arrear payment transactions
     * @param deviceNumber Device number or customer reference (rst_code) - optional
     * @return List of arrear transactions
     */
    public Map<String, Object> searchArrearTransactions(String deviceNumber) throws Exception {
        log.info("Calling search_arrear_trans API for device: {}",
                deviceNumber != null ? deviceNumber : "ALL");

        // Ensure we have a token first
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available, getting token first...");
            getVerifyCode();
        }

        String seed = generateSeed();

        try {
            // Generate signature for search_arrear_trans
            String signature = generateSearchArrearTransSignature(seed, deviceNumber);

            Map<String, Object> response = callSearchArrearTransAPI(seed, deviceNumber, signature);

            // Check if response is successful (state = 0)
            Object state = response.get("state");
            log.info("Search arrear trans response state: {}", state);

            if (state != null && (state.equals(0) || state.equals("0"))) {
                log.info("Successfully found arrear transactions");
                return response;
            } else {
                String errorMsg = String.format("Failed to search arrear transactions - State: %s, Message: %s",
                        state, response.get("message"));

                if (state != null && (state.equals(-95035) || state.equals("-95035"))) {
                    throw new RuntimeException("No arrear transactions found" +
                            (deviceNumber != null ? " for device: " + deviceNumber : ""));
                }

                throw new RuntimeException(errorMsg);
            }

        } catch (Exception e) {
            log.error("Error searching arrear transactions: ", e);
            throw e;
        }
    }

    /**
     * Generate signature for search_arrear_trans API
     */
    private String generateSearchArrearTransSignature(String seed, String deviceNumber) throws Exception {
        log.debug("Generating signature for search_arrear_trans");

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // StringA with parameters in alphabetical order
        String stringA;
        if (deviceNumber != null && !deviceNumber.isEmpty()) {
            stringA = String.format("rst_code=%s&seed=%s&user=%s&version=%d",
                    deviceNumber, seed, user, version);
        } else {
            // rst_code is optional, so exclude if not provided
            stringA = String.format("seed=%s&user=%s&version=%d",
                    seed, user, version);
        }

        // Value calculation with token (based on working patterns)
        String valueInput = user + pass + (currentToken != null ? currentToken : "");

        log.debug("Search Arrear Trans StringA: {}", stringA);
        log.debug("Search Arrear Trans ValueInput: {}", valueInput);

        // Rest of the algorithm
        String value = calculateMd5(valueInput);
        log.debug("Value: {}", value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Key: {}", key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("StringSignTemp: {}", stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Final signature: {}", signature);

        return signature;
    }

    /**
     * Call the search_arrear_trans API
     */
    private Map<String, Object> callSearchArrearTransAPI(String seed, String deviceNumber, String signature) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        if (deviceNumber != null && !deviceNumber.isEmpty()) {
            requestBody.put("rst_code", deviceNumber);
        }
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=ppe&action=search_arrear_trans";

        log.info("Search Arrear Trans Request URL: {}", url);
        log.info("Search Arrear Trans Request Body: {}", objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Search Arrear Trans Response Status: {}", response.getStatusCode());
            log.info("Search Arrear Trans Raw Response: {}", responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received");
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);

            // Parse details array if present
            if (parsedResponse.containsKey("details")) {
                Object details = parsedResponse.get("details");
                if (details instanceof String) {
                    try {
                        parsedResponse.put("details", objectMapper.readValue((String) details, List.class));
                    } catch (Exception e) {
                        log.debug("Could not parse details as JSON, returning as-is");
                    }
                }
            }

            return parsedResponse;

        } catch (Exception e) {
            log.error("HTTP/Parsing error for search_arrear_trans: {}", e.getMessage(), e);
            throw new RuntimeException("Search arrear trans API call failed: " + e.getMessage(), e);
        }
    }



    /**
     * Call get_bills API to get bills for a post-payment customer
     * @param customerReference ID, reference, or meter number of the customer
     * @return List of bills
     */
    public Map<String, Object> getBills(String customerReference) throws Exception {
        log.info("Calling get_bills API for customer: {}", customerReference);

        // Ensure we have a token first
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available, getting token first...");
            getVerifyCode();
        }

        String seed = generateSeed();

        try {
            // Generate signature for get_bills
            String signature = generateGetBillsSignature(seed, customerReference);

            Map<String, Object> response = callGetBillsAPI(seed, customerReference, signature);

            // Check if response is successful (state = 0)
            Object state = response.get("state");
            log.info("Get bills response state: {}", state);

            if (state != null && (state.equals(0) || state.equals("0"))) {
                log.info("Successfully retrieved bills for customer: {}", customerReference);
                return response;
            } else {
                String errorMsg = String.format("Failed to get bills - State: %s, Message: %s",
                        state, response.get("message"));

                if (state != null && (state.equals(-95051) || state.equals("-95051"))) {
                    throw new RuntimeException("No bills found for customer: " + customerReference);
                }

                throw new RuntimeException(errorMsg);
            }

        } catch (Exception e) {
            log.error("Error getting bills: ", e);
            throw e;
        }
    }


    /**
     * Call the get_bills API
     */
    private Map<String, Object> callGetBillsAPI(String seed, String customerReference, String signature) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        requestBody.put("rst_code", customerReference);
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=pps&action=get_bills";

        log.info("Get Bills Request URL: {}", url);
        log.info("Get Bills Request Body: {}", objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Get Bills Response Status: {}", response.getStatusCode());
            log.info("Get Bills Raw Response: {}", responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received");
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);

            // Parse bills array if present
            if (parsedResponse.containsKey("bills")) {
                parsedResponse.put("bills", parseBillsList(parsedResponse.get("bills")));
            }

            return parsedResponse;

        } catch (Exception e) {
            log.error("HTTP/Parsing error for get_bills: {}", e.getMessage(), e);
            throw new RuntimeException("Get bills API call failed: " + e.getMessage(), e);
        }
    }


    /**
     * Call bill_details API to get details of a specific bill
     * @param billCode Bill code or request code (can be Exp+Sn(6) or Id+BillNumber)
     * @return Bill details
     */
    public Map<String, Object> getBillDetails(String billCode) throws Exception {
        log.info("Calling bill_details API for bill code: {}", billCode);

        // Ensure we have a token first
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available, getting token first...");
            getVerifyCode();
        }

        String seed = generateSeed();

        try {
            // Generate signature for bill_details
            String signature = generateBillDetailsSignature(seed, billCode);

            Map<String, Object> response = callBillDetailsAPI(seed, billCode, signature);

            // Check if response is successful (state = 0)
            Object state = response.get("state");
            log.info("Bill details response state: {}", state);

            if (state != null && (state.equals(0) || state.equals("0"))) {
                log.info("Successfully retrieved bill details for code: {}", billCode);
                return response;
            } else {
                String errorMsg = String.format("Failed to get bill details - State: %s, Message: %s",
                        state, response.get("message"));

                if (state != null && (state.equals(-95051) || state.equals("-95051"))) {
                    throw new RuntimeException("Bill not found: " + billCode);
                }

                throw new RuntimeException(errorMsg);
            }

        } catch (Exception e) {
            log.error("Error getting bill details: ", e);
            throw e;
        }
    }

    /**
     * Generate signature for bill_details API
     */
    private String generateBillDetailsSignature(String seed, String billCode) throws Exception {
        log.debug("Generating signature for bill_details");

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // StringA with parameters in alphabetical order
        String stringA = String.format("rst_code=%s&seed=%s&user=%s&version=%d",
                billCode, seed, user, version);

        // Value calculation with token (based on working patterns)
        String valueInput = user + pass + (currentToken != null ? currentToken : "");

        log.debug("Bill Details StringA: {}", stringA);
        log.debug("Bill Details ValueInput: {}", valueInput);

        // Rest of the algorithm
        String value = calculateMd5(valueInput);
        log.debug("Value: {}", value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Key: {}", key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("StringSignTemp: {}", stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Final signature: {}", signature);

        return signature;
    }

    /**
     * Call the bill_details API
     */
    private Map<String, Object> callBillDetailsAPI(String seed, String billCode, String signature) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        requestBody.put("rst_code", billCode);
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=pps&action=bill_details";

        log.info("Bill Details Request URL: {}", url);
        log.info("Bill Details Request Body: {}", objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Bill Details Response Status: {}", response.getStatusCode());
            log.info("Bill Details Raw Response: {}", responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received");
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);

            return parsedResponse;

        } catch (Exception e) {
            log.error("HTTP/Parsing error for bill_details: {}", e.getMessage(), e);
            throw new RuntimeException("Bill details API call failed: " + e.getMessage(), e);
        }
    }

    /**
     * Check if customer has unpaid bills
     */
    public Map<String, Object> checkUnpaidBills(String customerReference) throws Exception {
        log.info("Checking unpaid bills for customer: {}", customerReference);

        try {
            // Get all bills
            Map<String, Object> billsResponse = getBills(customerReference);

            Map<String, Object> unpaidInfo = new HashMap<>();
            unpaidInfo.put("customer", customerReference);

            // Process bills if present
            if (billsResponse.containsKey("bills") && billsResponse.get("bills") instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> bills = (List<Map<String, Object>>) billsResponse.get("bills");

                List<Map<String, Object>> unpaidBills = new ArrayList<>();
                double totalUnpaid = 0.0;

                for (Map<String, Object> bill : bills) {
                    String status = bill.get("status") != null ? bill.get("status").toString() : "";

                    // Status: 1=non-payment, 2=In payment, 3=Paid
                    if ("1".equals(status) || "2".equals(status)) {
                        unpaidBills.add(bill);

                        try {
                            String balanceStr = bill.get("balance") != null ? bill.get("balance").toString() : "0";
                            totalUnpaid += Double.parseDouble(balanceStr);
                        } catch (NumberFormatException e) {
                            log.debug("Could not parse balance: {}", bill.get("balance"));
                        }
                    }
                }

                unpaidInfo.put("has_unpaid_bills", !unpaidBills.isEmpty());
                unpaidInfo.put("unpaid_count", unpaidBills.size());
                unpaidInfo.put("total_unpaid", totalUnpaid);
                unpaidInfo.put("unpaid_bills", unpaidBills);
                unpaidInfo.put("total_bills", bills.size());
            } else {
                unpaidInfo.put("has_unpaid_bills", false);
                unpaidInfo.put("unpaid_count", 0);
                unpaidInfo.put("total_unpaid", 0.0);
                unpaidInfo.put("unpaid_bills", new ArrayList<>());
                unpaidInfo.put("total_bills", 0);
            }

            return unpaidInfo;

        } catch (Exception e) {
            log.error("Error checking unpaid bills: ", e);
            throw new RuntimeException("Failed to check unpaid bills: " + e.getMessage(), e);
        }
    }


    /**
     * Helper method to parse bills list
     */
    private Object parseBillsList(Object bills) {
        if (bills instanceof String) {
            try {
                return objectMapper.readValue((String) bills, List.class);
            } catch (Exception e) {
                log.debug("Could not parse bills as JSON, returning as-is");
                return bills;
            }
        }
        return bills;
    }



    /**
     * Generate signature for get_bills API
     */
    private String generateGetBillsSignature(String seed, String customerReference) throws Exception {
        log.debug("Generating signature for get_bills");

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // StringA with parameters in alphabetical order
        String stringA = String.format("rst_code=%s&seed=%s&user=%s&version=%d",
                customerReference, seed, user, version);

        // Value calculation with token (based on working patterns)
        String valueInput = user + pass + (currentToken != null ? currentToken : "");

        log.debug("Get Bills StringA: {}", stringA);
        log.debug("Get Bills ValueInput: {}", valueInput);

        // Rest of the algorithm
        String value = calculateMd5(valueInput);
        log.debug("Value: {}", value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Key: {}", key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("StringSignTemp: {}", stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Final signature: {}", signature);

        return signature;
    }


    /**
     * Call pay_bill API to pay a post-payment bill
     * @param transactionId Transaction ID
     * @param billCode Bill code or request code (rst_code)
     * @param amount Payment amount
     * @param phoneNumber Customer phone number
     * @param channel Vending channel (01:USSD, 02:SMS, 03:APP, 04:Vending Client, 05:Web Site)
     * @param verifyCode Empty for pre-pay, "DONOTVERIFYDATA" for one-step, or verify code from pre-pay
     * @return Payment response
     */
    public Map<String, Object> payBill(String transactionId, String billCode, String amount,
                                       String phoneNumber, String channel, String verifyCode) throws Exception {
        log.info("Calling pay_bill API - TransID: {}, BillCode: {}, Amount: {}, Phone: {}, Channel: {}, VerifyCode: {}",
                transactionId, billCode, amount, phoneNumber, channel,
                verifyCode != null && !verifyCode.isEmpty() ? "PROVIDED" : "EMPTY");

        // Ensure we have a token first
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available for pay bill, getting token first...");
            getVerifyCode(); // This will store the token
        }

        String seed = generateSeed();

        try {
            // Use the same signature approach as working APIs (with token)
            log.info("Using proven signature approach with token for pay bill");
            String signature = generatePayBillSignature(seed, transactionId, billCode,
                    amount, phoneNumber, channel, verifyCode);

            Map<String, Object> response = callPayBillAPI(seed, transactionId, billCode,
                    amount, phoneNumber, channel, verifyCode, signature);

            // Check if response is successful (state = 0)
            Object state = response.get("state");
            log.info("Pay bill response state: {}", state);

            if (state != null && (state.equals(0) || state.equals("0"))) {
                log.info("Pay bill successful!");
                return response;
            } else if (state != null && (state.equals(-95051) || state.equals("-95051"))) {
                // Bill not found error
                throw new RuntimeException("Bill not found: " + billCode +
                        ". Please verify the bill code is correct.");
            } else {
                // Other errors
                String errorMsg = String.format("Pay bill failed - State: %s, Message: %s", state, response.get("message"));
                log.error(errorMsg);
                throw new RuntimeException(errorMsg);
            }

        } catch (Exception e) {
            log.error("Error in pay bill: ", e);
            throw e;
        }
    }


    /**
     * Generate signature for pay_bill API using the working approach (with token)
     */
    private String generatePayBillSignature(String seed, String transactionId, String billCode,
                                            String amount, String phoneNumber, String channel,
                                            String verifyCode) throws Exception {
        log.debug("Generating pay bill signature with token approach");

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // Ensure parameters are not null
        String transId = (transactionId != null && !transactionId.isEmpty()) ? transactionId : "";
        String rstCode = (billCode != null && !billCode.isEmpty()) ? billCode : "";
        String phone = (phoneNumber != null && !phoneNumber.isEmpty()) ? phoneNumber : "";
        String vCode = (verifyCode != null) ? verifyCode : "";
        String chan = (channel != null && !channel.isEmpty()) ? channel : "05";

        // StringA with all parameters in alphabetical order
        String stringA = String.format("amt=%s&channel=%s&phone=%s&rst_code=%s&seed=%s&trans_id=%s&user=%s&verify_code=%s&version=%d",
                amount, chan, phone, rstCode, seed, transId, user, vCode, version);

        // Value calculation WITH TOKEN (same as working APIs)
        String valueInput = user + pass + (currentToken != null ? currentToken : "");

        log.debug("Pay Bill StringA: {}", stringA);
        log.debug("Pay Bill ValueInput: {}", valueInput);
        log.debug("Current Token: {}", currentToken != null ? currentToken : "NO_TOKEN");

        // Rest of the algorithm
        String value = calculateMd5(valueInput);
        log.debug("Pay Bill Value: {}", value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Pay Bill Key: {}", key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("Pay Bill StringSignTemp: {}", stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Pay Bill Final signature: {}", signature);

        return signature;
    }

    /**
     * Call the pay_bill API with given parameters
     */
    private Map<String, Object> callPayBillAPI(String seed, String transactionId, String billCode,
                                               String amount, String phoneNumber, String channel,
                                               String verifyCode, String signature) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        requestBody.put("trans_id", transactionId);
        requestBody.put("rst_code", billCode);
        requestBody.put("amt", amount);
        requestBody.put("channel", channel);
        requestBody.put("phone", phoneNumber); // lowercase as per working APIs
        requestBody.put("verify_code", verifyCode != null ? verifyCode : "");
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=pps&action=pay_bill";

        log.info("Pay Bill Request URL: {}", url);
        log.info("Pay Bill Request Body: {}", objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Pay Bill Response Status: {}", response.getStatusCode());
            log.info("Pay Bill Response Content-Type: {}", contentType);
            log.info("Pay Bill Raw Response: {}", responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received for pay bill");
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);

            log.info("Pay Bill Parsed Response: {}", objectMapper.writeValueAsString(parsedResponse));

            return parsedResponse;

        } catch (Exception e) {
            log.error("Pay Bill HTTP/Parsing error: {}", e.getMessage(), e);
            throw new RuntimeException("Pay bill API call failed: " + e.getMessage(), e);
        }
    }


    /**
     * Call bill_trans_details API to get details of a specific bill payment transaction
     * @param transactionCode The transaction code or ID from a bill payment
     * @return Transaction details
     */
    public Map<String, Object> getBillTransactionDetails(String transactionCode) throws Exception {
        log.info("Calling bill_trans_details API for transaction code: {}", transactionCode);

        // Ensure we have a token first
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available, getting token first...");
            getVerifyCode();
        }

        String seed = generateSeed();

        try {
            // Generate signature for bill_trans_details
            String signature = generateBillTransDetailsSignature(seed, transactionCode);

            Map<String, Object> response = callBillTransDetailsAPI(seed, transactionCode, signature);

            // Check if response is successful (state = 0)
            Object state = response.get("state");
            log.info("Bill trans details response state: {}", state);

            if (state != null && (state.equals(0) || state.equals("0"))) {
                log.info("Successfully retrieved bill transaction details for code: {}", transactionCode);
                return response;
            } else {
                String errorMsg = String.format("Failed to get bill transaction details - State: %s, Message: %s",
                        state, response.get("message"));

                if (state != null && (state.equals(-95035) || state.equals("-95035"))) {
                    throw new RuntimeException("Bill transaction not found: " + transactionCode);
                }

                throw new RuntimeException(errorMsg);
            }

        } catch (Exception e) {
            log.error("Error getting bill transaction details: ", e);
            throw e;
        }
    }


    /**
     * Generate signature for bill_trans_details API
     */
    private String generateBillTransDetailsSignature(String seed, String transactionCode) throws Exception {
        log.debug("Generating signature for bill_trans_details");

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // StringA with parameters in alphabetical order
        String stringA = String.format("seed=%s&trans_code=%s&user=%s&version=%d",
                seed, transactionCode, user, version);

        // Value calculation with token (based on working patterns)
        String valueInput = user + pass + (currentToken != null ? currentToken : "");

        log.debug("Bill Trans Details StringA: {}", stringA);
        log.debug("Bill Trans Details ValueInput: {}", valueInput);

        // Rest of the algorithm
        String value = calculateMd5(valueInput);
        log.debug("Value: {}", value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Key: {}", key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("StringSignTemp: {}", stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Final signature: {}", signature);

        return signature;
    }

    /**
     * Call the bill_trans_details API
     */
    private Map<String, Object> callBillTransDetailsAPI(String seed, String transactionCode, String signature) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        requestBody.put("trans_code", transactionCode);
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=pps&action=bill_trans_details";

        log.info("Bill Trans Details Request URL: {}", url);
        log.info("Bill Trans Details Request Body: {}", objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Bill Trans Details Response Status: {}", response.getStatusCode());
            log.info("Bill Trans Details Raw Response: {}", responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received");
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);

            return parsedResponse;

        } catch (Exception e) {
            log.error("HTTP/Parsing error for bill_trans_details: {}", e.getMessage(), e);
            throw new RuntimeException("Bill trans details API call failed: " + e.getMessage(), e);
        }
    }

    /**
     * Call search_bill_trans API to search for bill payment transactions
     * @param searchCode Bill code, request code, ID, reference, or device number (optional)
     * @return List of bill transactions
     */
    public Map<String, Object> searchBillTransactions(String searchCode) throws Exception {
        log.info("Calling search_bill_trans API for search code: {}",
                searchCode != null ? searchCode : "ALL");

        // Ensure we have a token first
        if (currentToken == null || currentToken.isEmpty()) {
            log.info("No token available, getting token first...");
            getVerifyCode();
        }

        String seed = generateSeed();

        try {
            // Generate signature for search_bill_trans
            String signature = generateSearchBillTransSignature(seed, searchCode);

            Map<String, Object> response = callSearchBillTransAPI(seed, searchCode, signature);

            // Check if response is successful (state = 0)
            Object state = response.get("state");
            log.info("Search bill trans response state: {}", state);

            if (state != null && (state.equals(0) || state.equals("0"))) {
                log.info("Successfully found bill transactions");
                return response;
            } else {
                String errorMsg = String.format("Failed to search bill transactions - State: %s, Message: %s",
                        state, response.get("message"));

                if (state != null && (state.equals(-95211) || state.equals("-95211"))) {
                    throw new RuntimeException("Signature error in search bill transactions");
                }

                throw new RuntimeException(errorMsg);
            }

        } catch (Exception e) {
            log.error("Error searching bill transactions: ", e);
            throw e;
        }
    }

    /**
     * Generate signature for search_bill_trans API
     */
    private String generateSearchBillTransSignature(String seed, String searchCode) throws Exception {
        log.debug("Generating signature for search_bill_trans");

        // Step 2: Pass = HmacSHA256(password, password)
        String pass = calculateHmacSha256(password, password);
        log.debug("Pass: {}", pass);

        // StringA with parameters in alphabetical order
        String stringA;
        if (searchCode != null && !searchCode.isEmpty()) {
            stringA = String.format("rst_code=%s&seed=%s&user=%s&version=%d",
                    searchCode, seed, user, version);
        } else {
            // rst_code is optional, so exclude if not provided
            stringA = String.format("seed=%s&user=%s&version=%d",
                    seed, user, version);
        }

        // Value calculation with token (based on working patterns)
        String valueInput = user + pass + (currentToken != null ? currentToken : "");

        log.debug("Search Bill Trans StringA: {}", stringA);
        log.debug("Search Bill Trans ValueInput: {}", valueInput);

        // Rest of the algorithm
        String value = calculateMd5(valueInput);
        log.debug("Value: {}", value);

        String keyInput = value + seed;
        String key = calculateMd5(keyInput);
        log.debug("Key: {}", key);

        String stringSignTemp = stringA + "&key=" + key;
        log.debug("StringSignTemp: {}", stringSignTemp);

        String signature = calculateMd5(stringSignTemp).toUpperCase();
        log.debug("Final signature: {}", signature);

        return signature;
    }

    /**
     * Call the search_bill_trans API
     */
    private Map<String, Object> callSearchBillTransAPI(String seed, String searchCode, String signature) throws Exception {
        // Prepare request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("version", version);
        requestBody.put("user", user);
        requestBody.put("seed", seed);
        if (searchCode != null && !searchCode.isEmpty()) {
            requestBody.put("rst_code", searchCode);
        }
        requestBody.put("sign", signature);
        requestBody.put("sign_type", "MD5");

        String url = baseUrl + "/portal/agency/interface?type=pps&action=search_bill_trans";

        log.info("Search Bill Trans Request URL: {}", url);
        log.info("Search Bill Trans Request Body: {}", objectMapper.writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String responseBody = response.getBody();
            String contentType = response.getHeaders().getContentType() != null ?
                    response.getHeaders().getContentType().toString() : "application/json";

            log.info("Search Bill Trans Response Status: {}", response.getStatusCode());
            log.info("Search Bill Trans Raw Response: {}", responseBody);

            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response body received");
            }

            Map<String, Object> parsedResponse = parseResponse(responseBody, contentType);

            // Parse details array if present
            if (parsedResponse.containsKey("details")) {
                Object details = parsedResponse.get("details");
                if (details instanceof String) {
                    try {
                        parsedResponse.put("details", objectMapper.readValue((String) details, List.class));
                    } catch (Exception e) {
                        log.debug("Could not parse details as JSON, returning as-is");
                    }
                }
            }

            return parsedResponse;

        } catch (Exception e) {
            log.error("HTTP/Parsing error for search_bill_trans: {}", e.getMessage(), e);
            throw new RuntimeException("Search bill trans API call failed: " + e.getMessage(), e);
        }
    }






    /**
     * Helper method to parse sale details
     */
    private Object parseSaleDetails(Object saleDetails) {
        if (saleDetails instanceof String) {
            try {
                return objectMapper.readValue((String) saleDetails, List.class);
            } catch (Exception e) {
                log.debug("Could not parse sale_details as JSON, returning as-is");
                return saleDetails;
            }
        }
        return saleDetails;
    }

    /**
     * Helper method to parse fee details
     */
    private Object parseFeeDetails(Object feeDetails) {
        if (feeDetails instanceof String) {
            try {
                return objectMapper.readValue((String) feeDetails, List.class);
            } catch (Exception e) {
                log.debug("Could not parse fee_details as JSON, returning as-is");
                return feeDetails;
            }
        }
        return feeDetails;
    }

    /**
     * Helper method to parse arrear details
     */
    private Object parseArrearDetails(Object arrearDetails) {
        if (arrearDetails instanceof String) {
            try {
                return objectMapper.readValue((String) arrearDetails, List.class);
            } catch (Exception e) {
                log.debug("Could not parse arrear_details as JSON, returning as-is");
                return arrearDetails;
            }
        }
        return arrearDetails;
    }


    /**
     * Parse response based on content type
     */
    private Map<String, Object> parseResponse(String responseBody, String contentType) throws Exception {
        if (responseBody == null || responseBody.trim().isEmpty()) {
            throw new RuntimeException("Empty response body received");
        }

        try {
            // First try JSON parsing if it looks like JSON
            if (responseBody.trim().startsWith("{") || contentType.toLowerCase().contains("json")) {
                log.debug("Parsing JSON response");
                return objectMapper.readValue(responseBody, Map.class);
            }

            // If it's XML, try Jackson XML first
            if (contentType.toLowerCase().contains("xml") || responseBody.trim().startsWith("<")) {
                log.debug("Parsing XML response with Jackson");
                try {
                    return xmlMapper.readValue(responseBody, Map.class);
                } catch (Exception xmlException) {
                    log.warn("Jackson XML parsing failed, trying manual parsing: {}", xmlException.getMessage());
                    return parseXmlManually(responseBody);
                }
            }

            // Fallback to manual XML parsing
            return parseXmlManually(responseBody);

        } catch (Exception e) {
            log.error("Failed to parse response. Raw response: {}", responseBody);
            // Return raw response in error case
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("raw_response", responseBody);
            errorResponse.put("content_type", contentType);
            errorResponse.put("parsing_error", e.getMessage());
            return errorResponse;
        }
    }

    /**
     * Parse XML manually using regex patterns
     */
    private Map<String, Object> parseXmlManually(String xml) {
        Map<String, Object> result = new HashMap<>();

        // Extract common fields
        result.put("state", extractXmlValue(xml, "state"));
        result.put("seed", extractXmlValue(xml, "seed"));
        result.put("tokens", extractXmlValue(xml, "tokens"));
        result.put("start_time", extractXmlValue(xml, "start_time"));
        result.put("end_time", extractXmlValue(xml, "end_time"));
        result.put("sign", extractXmlValue(xml, "sign"));
        result.put("code", extractXmlValue(xml, "code"));
        result.put("ref_code", extractXmlValue(xml, "ref_code"));
        result.put("name", extractXmlValue(xml, "name"));
        result.put("status", extractXmlValue(xml, "status"));

        // Handle accounts array/section if present
        String accountsSection = extractXmlSection(xml, "accounts");
        if (accountsSection != null && !accountsSection.isEmpty()) {
            result.put("accounts", accountsSection);
        }

        // Remove null values
        result.entrySet().removeIf(entry -> entry.getValue() == null);

        log.debug("Manually parsed XML result: {}", result);
        return result;
    }

    /**
     * Extract value from XML tag
     */
    private String extractXmlValue(String xml, String tagName) {
        try {
            String pattern = "<" + tagName + ">(.*?)</" + tagName + ">";
            java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
            java.util.regex.Matcher m = p.matcher(xml);
            if (m.find()) {
                return m.group(1).trim();
            }
            return null;
        } catch (Exception e) {
            log.debug("Failed to extract XML value for tag: {}", tagName);
            return null;
        }
    }

    /**
     * Extract XML section
     */
    private String extractXmlSection(String xml, String sectionName) {
        try {
            String pattern = "<" + sectionName + ">(.*?)</" + sectionName + ">";
            java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern, java.util.regex.Pattern.DOTALL);
            java.util.regex.Matcher m = p.matcher(xml);
            if (m.find()) {
                return m.group(1).trim();
            }
            return null;
        } catch (Exception e) {
            log.debug("Failed to extract XML section: {}", sectionName);
            return null;
        }
    }

    /**
     * Generate a random seed (16 hex characters)
     */
    private String generateSeed() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }

    /**
     * Calculate HMAC-SHA256
     */
    public static String calculateHmacSha256(String data, String key) throws Exception {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256Hmac.init(secretKey);
        byte[] hash = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hash);
    }

    /**
     * Calculate MD5 hash
     */
    public static String calculateMd5(String input) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hash);
    }

    /**
     * Convert byte array to hexadecimal string
     */
    public static String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    /**
     * Clear stored token
     */
    public void clearToken() {
        this.currentToken = null;
    }
}