package io.digiservices.ecreditservice.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Editor: DELL
 * Date: 2023-10-30
 * Version: 1.0
 */
public class SignatureCalculator {

    private final String user;
    private final String password;
    private final String pass; // HMAC-SHA256 du password
    private String token;

    public SignatureCalculator(String user, String password) throws Exception {
        this.user = user;
        this.password = password;
        this.pass = calculateHmacSha256(password, password);
        this.token = null;
        System.out.println("HMAC-SHA256 Pass: " + this.pass);
    }

    /**
     * Calculer HMAC-SHA256
     */
    public String calculateHmacSha256(String data, String key) throws Exception {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256Hmac.init(secretKey);
        byte[] hash = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hash);
    }

    /**
     * Calculer MD5
     */
    public String calculateMd5(String input) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hash);
    }

    /**
     * Convertir byte array en hexadécimal
     */
    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    /**
     * Définir le token après get_verify_code
     */
    public void setToken(String token) {
        this.token = token;
        System.out.println("Token set: " + token);
    }

    /**
     * Obtenir le token actuel
     */
    public String getToken() {
        return token;
    }

    /**
     * Calculer la signature pour n'importe quel endpoint
     */
    public String calculateSignature(String stringA, boolean useToken) throws NoSuchAlgorithmException {
        System.out.println("\n=== Calcul de Signature ===");
        System.out.println("StringA: " + stringA);

        // Step 3: Value
        String valueInput = user + pass;
        if (useToken && token != null && !token.isEmpty()) {
            valueInput += token;
        }
        System.out.println("ValueInput: " + valueInput);

        String value = calculateMd5(valueInput);
        System.out.println("Value (MD5): " + value);

        // Step 4: Key
        String seed = extractSeed(stringA);
        String keyInput = value + seed;
        System.out.println("KeyInput: " + keyInput);

        String key = calculateMd5(keyInput);
        System.out.println("Key (MD5): " + key);

        // Step 5: StringSignTemp
        String stringSignTemp = stringA + "&key=" + key;
        System.out.println("StringSignTemp: " + stringSignTemp);

        // Step 6: Signature finale
        String signature = calculateMd5(stringSignTemp).toUpperCase();
        System.out.println("Signature finale: " + signature);
        System.out.println("=========================\n");

        return signature;
    }

    /**
     * Extraire le seed de StringA
     */
    private String extractSeed(String stringA)
    {
        Pattern pattern = Pattern.compile("seed=([A-F0-9]+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(stringA);
        return matcher.find() ? matcher.group(1) : "";
    }

    /**
     * 1. GET_VERIFY_CODE
     */

    public String getVerifyCodeSignature(String seed, int hours, int version) throws NoSuchAlgorithmException {
        String stringA = String.format("hours=%d&seed=%s&user=%s&version=%d", hours, seed, user, version);
        return calculateSignature(stringA, false); // Pas de token
    }

    /**
     * 2. ACCOUNTDETAIL
     */


    public String accountDetailSignature(String seed, int version) throws NoSuchAlgorithmException {
        String stringA = String.format("seed=%s&user=%s&version=%d", seed, user, version);
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * 3. GET_CST_DETAILS
     */
    public String getCustomerDetailsSignature(String seed, String rstValue) throws NoSuchAlgorithmException {
        return getCustomerDetailsSignature(seed, rstValue, 0);
    }

    public String getCustomerDetailsSignature(String seed, String rstValue, int version) throws NoSuchAlgorithmException {
        String stringA = String.format("rst_value=%s&seed=%s&user=%s&version=%d", rstValue, seed, user, version);
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * 4. SALE
     */
    public String saleSignature(String seed, String transId, String rstCode, String amt, String phone) throws NoSuchAlgorithmException {
        return saleSignature(seed, transId, rstCode, amt, phone, "05", "", 0);
    }

    public String saleSignature(String seed, String transId, String rstCode, String amt, String phone,
                                String channel, String verifyCode, int version) throws NoSuchAlgorithmException {
        String calcMode = "M";
        String stringA = String.format("amt=%s&calc_mode=%s&channel=%s&phone=%s&rst_code=%s&seed=%s&trans_id=%s&user=%s&verify_code=%s&version=%d",
                amt, calcMode, channel, phone, rstCode, seed, transId, user, verifyCode, version);
        return calculateSignature(stringA, true); // Avec token
    }



    public String transferAmtSignature(String seed, String transId, String rstValue, String amt, int version) throws NoSuchAlgorithmException {
        String stringA = String.format("amt=%s&rst_value=%s&seed=%s&trans_id=%s&user=%s&version=%d",
                amt, rstValue, seed, transId, user, version);
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * 5. PAYARREAR
     */
    public String payArrearSignature(String seed, String transId, String rstCode, String amt, String phone) throws NoSuchAlgorithmException {
        return payArrearSignature(seed, transId, rstCode, amt, phone, "05", "", 0);
    }

    public String payArrearSignature(String seed, String transId, String rstCode, String amt, String phone,
                                     String channel, String verifyCode, int version) throws NoSuchAlgorithmException {
        String stringA = String.format("amt=%s&channel=%s&phone=%s&rst_code=%s&seed=%s&trans_id=%s&user=%s&verify_code=%s&version=%d",
                amt, channel, phone, rstCode, seed, transId, user, verifyCode, version);
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * 6. GET_BILLS
     */
    public String getBillsSignature(String seed, String rstCode) throws NoSuchAlgorithmException {
        return getBillsSignature(seed, rstCode, 0);
    }

    public String getBillsSignature(String seed, String rstCode, int version) throws NoSuchAlgorithmException {
        String stringA = String.format("rst_code=%s&seed=%s&user=%s&version=%d", rstCode, seed, user, version);
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * 7. PAY_BILL
     */
    public String payBillSignature(String seed, String transId, String rstCode, String amt, String phone) throws NoSuchAlgorithmException {
        return payBillSignature(seed, transId, rstCode, amt, phone, "05", "", 0);
    }

    public String payBillSignature(String seed, String transId, String rstCode, String amt, String phone,
                                   String channel, String verifyCode, int version) throws NoSuchAlgorithmException {
        String stringA = String.format("amt=%s&channel=%s&phone=%s&rst_code=%s&seed=%s&trans_id=%s&user=%s&verify_code=%s&version=%d",
                amt, channel, phone, rstCode, seed, transId, user, verifyCode, version);
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * 8. SALES_TRANS_DETAILS
     */
    public String salesTransDetailsSignature(String seed, String code) throws NoSuchAlgorithmException {
        return salesTransDetailsSignature(seed, code, 0);
    }

    public String salesTransDetailsSignature(String seed, String code, int version) throws NoSuchAlgorithmException {
        String stringA = String.format("code=%s&seed=%s&user=%s&version=%d", code, seed, user, version);
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * 9. SEARCH_SALE_TRANS
     */
    public String searchSaleTransSignature(String seed, String rstCode) throws NoSuchAlgorithmException {
        return searchSaleTransSignature(seed, rstCode, 10, 0);
    }

    public String searchSaleTransSignature(String seed, String rstCode, int count, int version) throws NoSuchAlgorithmException {
        String stringA = String.format("count=%d&rst_code=%s&seed=%s&user=%s&version=%d",
                count, rstCode, seed, user, version);
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * 10. ARREAR_TRANS_DETAILS
     */
    public String arrearTransDetailsSignature(String seed, String transCode) throws NoSuchAlgorithmException {
        return arrearTransDetailsSignature(seed, transCode, 0);
    }

    public String arrearTransDetailsSignature(String seed, String transCode, int version) throws NoSuchAlgorithmException {
        String stringA = String.format("seed=%s&trans_code=%s&user=%s&version=%d", seed, transCode, user, version);
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * 10. SEARCH_ARREAR_TRANS
     */
    public String searchArrearTransSignature(String seed, String rstCode) throws NoSuchAlgorithmException {
        return searchArrearTransSignature(seed, rstCode, 0);
    }

    public String searchArrearTransSignature(String seed, String rstCode, int version) throws NoSuchAlgorithmException {
        String stringA;
        if (rstCode != null && !rstCode.isEmpty()) {
            stringA = String.format("rst_code=%s&seed=%s&user=%s&version=%d", rstCode, seed, user, version);
        } else {
            stringA = String.format("seed=%s&user=%s&version=%d", seed, user, version);
        }
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * 11. BILL_DETAILS
     */
    public String billDetailsSignature(String seed, String billCode) throws NoSuchAlgorithmException {
        return billDetailsSignature(seed, billCode, 0);
    }

    public String billDetailsSignature(String seed, String billCode, int version) throws NoSuchAlgorithmException {
        String stringA = String.format("rst_code=%s&seed=%s&user=%s&version=%d", billCode, seed, user, version);
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * 12. BILL_TRANS_DETAILS
     */
    public String billTransDetailsSignature(String seed, String transCode) throws NoSuchAlgorithmException {
        return billTransDetailsSignature(seed, transCode, 0);
    }

    public String billTransDetailsSignature(String seed, String transCode, int version) throws NoSuchAlgorithmException {
        String stringA = String.format("seed=%s&trans_code=%s&user=%s&version=%d", seed, transCode, user, version);
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * 15. SEARCH_BILL_TRANS
     */
    public String searchBillTransSignature(String seed, String searchCode) throws NoSuchAlgorithmException {
        return searchBillTransSignature(seed, searchCode, 0);
    }

    public String searchBillTransSignature(String seed, String searchCode, int version) throws NoSuchAlgorithmException {
        String stringA;
        if (searchCode != null && !searchCode.isEmpty()) {
            stringA = String.format("rst_code=%s&seed=%s&user=%s&version=%d", searchCode, seed, user, version);
        } else {
            stringA = String.format("seed=%s&user=%s&version=%d", seed, user, version);
        }
        return calculateSignature(stringA, true); // Avec token
    }

    /**
     * Générer un seed aléatoire (16 caractères hexadécimaux)
     */
    public String generateSeed() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }

    /**
     * Afficher le body de requête JSON formaté
     */
    public void printRequestBody(String endpoint, Map<String, Object> params) {
        System.out.println("\nRequest Body pour " + endpoint + ":");
        System.out.println("{");
        params.forEach((key, value) -> {
            if (value instanceof String) {
                System.out.println("    \"" + key + "\": \"" + value + "\",");
            } else {
                System.out.println("    \"" + key + "\": " + value + ",");
            }
        });
        System.out.println("}");
    }


}