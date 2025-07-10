package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.IntegrationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
@Slf4j
public class IntegrationResource {

    private final IntegrationService integrationService;

    @GetMapping("/edg/getFirstToken")
    public ResponseEntity<Response> getFirstToken(HttpServletRequest request) {
        try {
            log.info("Getting first token from partner API");

            // Call the get_verify_code API through service
            Map<String, Object> tokenResponse = integrationService.getVerifyCode();

            return ok(getResponse(request, tokenResponse, "Token Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting first token: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Token Retrieval Failed", OK));
        }
    }

    @GetMapping("/edg/accountDetail")
    public ResponseEntity<Response> getAccountDetail(
                                                     HttpServletRequest request) {
        try {
            log.info("Getting account details from partner API");

            // Call the accountdetail API through service
            Map<String, Object> accountResponse = integrationService.getAccountDetails();

            return ok(getResponse(request, accountResponse, "Account Details Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting account details: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Account Details Retrieval Failed", OK));
        }
    }

    @GetMapping("/edg/completeAccountInfo")
    public ResponseEntity<Response> getCompleteAccountInfo(
                                                           HttpServletRequest request) {
        try {
            log.info("Getting complete account information from partner API");

            // Get both token and account details in one call
            Map<String, Object> completeResponse = integrationService.getCompleteAccountInfo();

            return ok(getResponse(request, completeResponse, "Complete Account Information Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting complete account information: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Complete Account Information Retrieval Failed", OK));
        }
    }

    @GetMapping("/edg/customerDetails")
    public ResponseEntity<Response> getCustomerDetails(
                                                       HttpServletRequest request,
                                                       @RequestParam(value = "customerReference", required = false) String customerReference) {
        try {
            log.info("Getting customer details from partner API for reference: {}", customerReference);

            // Call the get_cst_details API through service
            Map<String, Object> customerResponse = integrationService.getCustomerDetails(customerReference);

            return ok(getResponse(request, customerResponse, "Customer Details Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting customer details: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Customer Details Retrieval Failed", OK));
        }
    }

    @GetMapping("/edg/tokenStatus")
    public ResponseEntity<Response> getTokenStatus(
                                                   HttpServletRequest request) {
        try {
            String status = integrationService.getCurrentTokenStatus();
            return ok(getResponse(request, Map.of("status", status), "Token Status Retrieved", OK));
        } catch (Exception e) {
            log.error("Error getting token status: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Token Status Retrieval Failed", OK));
        }
    }

    @PostMapping("/edg/transferAmount")
    public ResponseEntity<Response> transferAmount(
                                                   HttpServletRequest request,
                                                   @RequestParam(value = "transactionId", required = false) String transactionId,
                                                   @RequestParam("recipientCode") String recipientCode,
                                                   @RequestParam("amount") String amount) {
        try {
            // Use empty string if transactionId is not provided (as per documentation example)
            String transId = (transactionId != null && !transactionId.trim().isEmpty()) ? transactionId : "";

            log.info("Transferring amount from partner API - TransID: '{}', Recipient: {}, Amount: {}",
                    transId, recipientCode, amount);

            // Validate required parameters
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "Transfer Amount Failed", OK));
            }

            if (recipientCode == null || recipientCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Recipient code is required"), "Transfer Amount Failed", OK));
            }

            // Validate amount format
            try {
                double amountValue = Double.parseDouble(amount);
                if (amountValue <= 0) {
                    return ResponseEntity.badRequest()
                            .body(getResponse(request, Map.of("error", "Amount must be positive"), "Transfer Amount Failed", OK));
                }
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Invalid amount format"), "Transfer Amount Failed", OK));
            }

            // Call the transfer_amt API through service
            Map<String, Object> transferResponse = integrationService.transferAmount(transId, recipientCode, amount);

            return ok(getResponse(request, transferResponse, "Amount Transferred Successfully", OK));

        } catch (Exception e) {
            log.error("Error transferring amount: ", e);

            // Provide more helpful error messages
            String errorMessage = e.getMessage();
            if (errorMessage.contains("-95081")) {
                errorMessage = "Transfer failed: User does not have permission to transfer. Please check:\n" +
                        "1. User transfer privileges are enabled\n" +
                        "2. Recipient code format is correct (user code, contract code, mobile number, or email)\n" +
                        "3. Transfer limits are not exceeded";
            } else if (errorMessage.contains("-95211")) {
                errorMessage = "Transfer failed: Authentication error. Please try again.";
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage), "Transfer Amount Failed", OK));
        }
    }


    /**
     * Pre-sale power payment endpoint
     */
    @PostMapping("/edg/preSalePower")
    public ResponseEntity<Response> preSalePower(
                                                 HttpServletRequest request,
                                                 @RequestParam("transactionId") String transactionId,
                                                 @RequestParam("deviceNumber") String deviceNumber,
                                                 @RequestParam("amount") String amount,
                                                 @RequestParam("phoneNumber") String phoneNumber,
                                                 @RequestParam(value = "channel", defaultValue = "05") String channel) {
        try {
            log.info("Pre-sale power payment - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel);

            // Validate required parameters
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "Pre-Sale Power Failed", OK));
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Phone number is required"), "Pre-Sale Power Failed", OK));
            }

            // Call pre-sale service
            Map<String, Object> preSaleResponse = integrationService.preSalePower(
                    transactionId, deviceNumber, amount, phoneNumber, channel);

            return ok(getResponse(request, preSaleResponse, "Pre-Sale Power Successful", OK));

        } catch (Exception e) {
            log.error("Error in pre-sale power: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Pre-Sale Power Failed", OK));
        }
    }

    /**
     * Complete power sale endpoint
     */
    @PostMapping("/edg/completeSalePower")
    public ResponseEntity<Response> completeSalePower(
                                                      HttpServletRequest request,
                                                      @RequestParam("transactionId") String transactionId,
                                                      @RequestParam("deviceNumber") String deviceNumber,
                                                      @RequestParam("amount") String amount,
                                                      @RequestParam("phoneNumber") String phoneNumber,
                                                      @RequestParam("verifyCode") String verifyCode,
                                                      @RequestParam(value = "channel", defaultValue = "05") String channel) {
        try {
            log.info("Complete sale power - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}, VerifyCode: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel,
                    verifyCode != null && !verifyCode.isEmpty() ? "PROVIDED" : "MISSING");

            // Validate required parameters
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "Complete Sale Power Failed", OK));
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Phone number is required"), "Complete Sale Power Failed", OK));
            }
            if (verifyCode == null || verifyCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Verify code is required"), "Complete Sale Power Failed", OK));
            }

            // Complete the sale
            Map<String, Object> saleResponse = integrationService.completeSalePower(
                    transactionId, deviceNumber, amount, phoneNumber, channel, verifyCode);

            return ok(getResponse(request, saleResponse, "Sale Power Completed Successfully", OK));

        } catch (Exception e) {
            log.error("Error completing sale power: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Complete Sale Power Failed", OK));
        }
    }

    /**
     * One-step power sale endpoint (bypasses pre-sale verification)
     */
    @PostMapping("/edg/salePowerOneStep")
    public ResponseEntity<Response> salePowerOneStep(
                                                     HttpServletRequest request,
                                                     @RequestParam("transactionId") String transactionId,
                                                     @RequestParam("deviceNumber") String deviceNumber,
                                                     @RequestParam("amount") String amount,
                                                     @RequestParam("phoneNumber") String phoneNumber,
                                                     @RequestParam(value = "channel", defaultValue = "03") String channel) {
        try {
            log.info("One-step sale power - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel);

            // Validate required parameters
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "One-Step Sale Power Failed", OK));
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Phone number is required"), "One-Step Sale Power Failed", OK));
            }

            // Execute one-step sale
            Map<String, Object> saleResponse = integrationService.salePowerOneStep(
                    transactionId, deviceNumber, amount, phoneNumber, channel);

            return ok(getResponse(request, saleResponse, "One-Step Sale Power Successful", OK));

        } catch (Exception e) {
            log.error("Error in one-step sale power: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "One-Step Sale Power Failed", OK));
        }
    }

    /**
     * 610355969
     * Combined endpoint for power sale with flexible verify code handling
     */
    @PostMapping("/edg/salePower")
    public ResponseEntity<Response> salePower(
                                              HttpServletRequest request,
                                              @RequestParam("transactionId") String transactionId,
                                              @RequestParam("deviceNumber") String deviceNumber,
                                              @RequestParam("amount") String amount,
                                              @RequestParam("phoneNumber") String phoneNumber,
                                              @RequestParam(value = "channel", defaultValue = "05") String channel,
                                              @RequestParam(value = "verifyCode", required = false) String verifyCode,
                                              @RequestParam(value = "oneStep", defaultValue = "false") boolean oneStep) {
        try {
            log.info("Sale power - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}, OneStep: {}, VerifyCode: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel, oneStep,
                    verifyCode != null && !verifyCode.isEmpty() ? "PROVIDED" : "EMPTY");

            // Validate required parameters
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "Sale Power Failed", OK));
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Phone number is required"), "Sale Power Failed", OK));
            }

            Map<String, Object> saleResponse;

            if (oneStep) {
                // One-step sale
                saleResponse = integrationService.salePowerOneStep(
                        transactionId, deviceNumber, amount, phoneNumber, channel);
            } else if (verifyCode != null && !verifyCode.trim().isEmpty()) {
                // Complete sale with verify code
                saleResponse = integrationService.completeSalePower(
                        transactionId, deviceNumber, amount, phoneNumber, channel, verifyCode);
            } else {
                // Pre-sale
                saleResponse = integrationService.preSalePower(
                        transactionId, deviceNumber, amount, phoneNumber, channel);
            }

            return ok(getResponse(request, saleResponse, "Sale Power Request Processed Successfully", OK));

        } catch (Exception e) {
            log.error("Error in sale power: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Sale Power Failed", OK));
        }
    }


    /**
     * Get details of a specific sales transaction
     */
    @GetMapping("/edg/salesTransactionDetails")
    public ResponseEntity<Response> getSalesTransactionDetails(HttpServletRequest request,
                                                               @RequestParam("transactionCode") String transactionCode) {
        try {
            log.info("Getting sales transaction details for code: {}", transactionCode);

            // Validate parameter
            if (transactionCode == null || transactionCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Transaction code is required"),
                                "Get Transaction Details Failed", OK));
            }

            // Get transaction details
            Map<String, Object> transactionDetails = integrationService.getSalesTransactionDetails(transactionCode);

            return ok(getResponse(request, transactionDetails, "Transaction Details Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting transaction details: ", e);

            String errorMessage = e.getMessage();
            if (errorMessage.contains("Transaction not found")) {
                errorMessage = "Transaction code not found: " + transactionCode +
                        ". Please verify the code is correct and recent.";
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage),
                            "Get Transaction Details Failed", OK));
        }
    }



    /**
     * Search for sales transactions by device number
     */
    @GetMapping("/edg/searchSalesTransactions")
    public ResponseEntity<Response> searchSalesTransactions(
                                                            HttpServletRequest request,
                                                            @RequestParam("deviceNumber") String deviceNumber,
                                                            @RequestParam(value = "count", defaultValue = "10") Integer count) {
        try {
            log.info("Searching sales transactions for device: {}, count: {}", deviceNumber, count);

            // Validate parameters
            if (deviceNumber == null || deviceNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Device number is required"),
                                "Search Transactions Failed", OK));
            }

            if (count != null && count <= 0) {
                count = 10; // Default to 10 if invalid
            }

            // Search transactions
            Map<String, Object> searchResults = integrationService.searchSalesTransactions(deviceNumber, count);

            return ok(getResponse(request, searchResults, "Transactions Search Successful", OK));

        } catch (Exception e) {
            log.error("Error searching transactions: ", e);

            String errorMessage = e.getMessage();
            if (errorMessage.contains("No transactions found")) {
                errorMessage = "No transactions found for device: " + deviceNumber;
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage),
                            "Search Transactions Failed", OK));
        }
    }

    /**
     * Verify a transaction and get its details (convenience endpoint)
     */
    @GetMapping("/edg/verifyTransaction")
    public ResponseEntity<Response> verifyTransaction(
                                                      HttpServletRequest request,
                                                      @RequestParam("transactionCode") String transactionCode) {
        try {
            log.info("Verifying transaction: {}", transactionCode);

            Map<String, Object> verificationResult = new HashMap<>();

            try {
                // Get transaction details
                Map<String, Object> details = integrationService.getSalesTransactionDetails(transactionCode);

                verificationResult.put("valid", true);
                verificationResult.put("transaction", details);

                // Extract key information for quick verification
                verificationResult.put("summary", Map.of(
                        "transactionCode", transactionCode,
                        "customerName", details.getOrDefault("name", ""),
                        "device", details.getOrDefault("device", ""),
                        "amount", details.getOrDefault("amt", ""),
                        "tokens", details.getOrDefault("tokens", ""),
                        "transactionTime", details.getOrDefault("trans_time", "")
                ));

            } catch (Exception e) {
                verificationResult.put("valid", false);
                verificationResult.put("error", e.getMessage());
                verificationResult.put("transactionCode", transactionCode);
            }

            return ok(getResponse(request, verificationResult, "Transaction Verification Complete", OK));

        } catch (Exception e) {
            log.error("Error verifying transaction: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Transaction Verification Failed", OK));
        }
    }

    /**
     * Get recent transactions for a device (simplified endpoint)
     */
    @GetMapping("/edg/recentTransactions")
    public ResponseEntity<Response> getRecentTransactions(
                                                          HttpServletRequest request,
                                                          @RequestParam("deviceNumber") String deviceNumber) {
        try {
            log.info("Getting recent transactions for device: {}", deviceNumber);

            // Get last 5 transactions
            Map<String, Object> searchResults = integrationService.searchSalesTransactions(deviceNumber, 5);

            Map<String, Object> recentTransactions = new HashMap<>();
            recentTransactions.put("device", deviceNumber);
            recentTransactions.put("ref_code", searchResults.get("ref_code"));

            // Format transaction list for easier consumption
            if (searchResults.containsKey("details") && searchResults.get("details") instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> transactions = (List<Map<String, Object>>) searchResults.get("details");

                List<Map<String, Object>> formattedTransactions = transactions.stream()
                        .map(trans -> Map.of(
                                "code", trans.getOrDefault("code", ""),
                                "time", trans.getOrDefault("time", ""),
                                "amount", trans.getOrDefault("amt", ""),
                                "operator", trans.getOrDefault("operator", "")
                        ))
                        .collect(Collectors.toList());

                recentTransactions.put("transactions", formattedTransactions);
                recentTransactions.put("count", formattedTransactions.size());
            } else {
                recentTransactions.put("transactions", new ArrayList<>());
                recentTransactions.put("count", 0);
            }

            return ok(getResponse(request, recentTransactions, "Recent Transactions Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting recent transactions: ", e);

            String errorMessage = e.getMessage();
            if (errorMessage.contains("No transactions found")) {
                // Return empty result instead of error
                Map<String, Object> emptyResult = Map.of(
                        "device", deviceNumber,
                        "transactions", new ArrayList<>(),
                        "count", 0,
                        "message", "No transactions found for this device"
                );
                return ok(getResponse(request, emptyResult, "No Transactions Found", OK));
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage),
                            "Get Recent Transactions Failed", OK));
        }
    }





    /**
     * Check if customer has arrears
     */
    @GetMapping("/edg/checkArrears")
    public ResponseEntity<Response> checkArrears(HttpServletRequest request,
                                                 @RequestParam("deviceNumber") String deviceNumber) {
        try {
            log.info("Checking arrears for device: {}", deviceNumber);

            // Validate parameter
            if (deviceNumber == null || deviceNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Device number is required"),
                                "Check Arrears Failed", OK));
            }

            // Check arrears
            Map<String, Object> arrearInfo = integrationService.checkArrears(deviceNumber);

            return ok(getResponse(request, arrearInfo, "Arrears Check Successful", OK));

        } catch (Exception e) {
            log.error("Error checking arrears: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Check Arrears Failed", OK));
        }
    }

    /**
     * Pre-pay arrear endpoint
     */
    @PostMapping("/edg/prePayArrear")
    public ResponseEntity<Response> prePayArrear(@NotNull Authentication authentication,
                                                 HttpServletRequest request,
                                                 @RequestParam("transactionId") String transactionId,
                                                 @RequestParam("deviceNumber") String deviceNumber,
                                                 @RequestParam("amount") String amount,
                                                 @RequestParam("phoneNumber") String phoneNumber,
                                                 @RequestParam(value = "channel", defaultValue = "05") String channel) {
        try {
            log.info("Pre-pay arrear - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel);

            // Validate required parameters
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "Pre-Pay Arrear Failed", OK));
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Phone number is required"), "Pre-Pay Arrear Failed", OK));
            }

            // Call pre-pay service
            Map<String, Object> prePayResponse = integrationService.prePayArrear(
                    transactionId, deviceNumber, amount, phoneNumber, channel);

            return ok(getResponse(request, prePayResponse, "Pre-Pay Arrear Successful", OK));

        } catch (Exception e) {
            log.error("Error in pre-pay arrear: ", e);

            String errorMessage = e.getMessage();
            if (errorMessage.contains("Customer not found")) {
                errorMessage = "Customer not found or device has no arrears";
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage), "Pre-Pay Arrear Failed", OK));
        }
    }

    /**
     * Complete arrear payment endpoint
     */
    @PostMapping("/edg/completePayArrear")
    public ResponseEntity<Response> completePayArrear(@NotNull Authentication authentication,
                                                      HttpServletRequest request,
                                                      @RequestParam("transactionId") String transactionId,
                                                      @RequestParam("deviceNumber") String deviceNumber,
                                                      @RequestParam("amount") String amount,
                                                      @RequestParam("phoneNumber") String phoneNumber,
                                                      @RequestParam("verifyCode") String verifyCode,
                                                      @RequestParam(value = "channel", defaultValue = "05") String channel) {
        try {
            log.info("Complete pay arrear - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}, VerifyCode: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel,
                    verifyCode != null && !verifyCode.isEmpty() ? "PROVIDED" : "MISSING");

            // Validate required parameters
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "Complete Pay Arrear Failed", OK));
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Phone number is required"), "Complete Pay Arrear Failed", OK));
            }
            if (verifyCode == null || verifyCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Verify code is required"), "Complete Pay Arrear Failed", OK));
            }

            // Complete the payment
            Map<String, Object> paymentResponse = integrationService.completePayArrear(
                    transactionId, deviceNumber, amount, phoneNumber, channel, verifyCode);

            return ok(getResponse(request, paymentResponse, "Arrear Payment Completed Successfully", OK));

        } catch (Exception e) {
            log.error("Error completing pay arrear: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Complete Pay Arrear Failed", OK));
        }
    }

    /**
     * One-step arrear payment endpoint (bypasses pre-pay verification)
     */
    @PostMapping("/edg/payArrearOneStep")
    public ResponseEntity<Response> payArrearOneStep(@NotNull Authentication authentication,
                                                     HttpServletRequest request,
                                                     @RequestParam("transactionId") String transactionId,
                                                     @RequestParam("deviceNumber") String deviceNumber,
                                                     @RequestParam("amount") String amount,
                                                     @RequestParam("phoneNumber") String phoneNumber,
                                                     @RequestParam(value = "channel", defaultValue = "05") String channel) {
        try {
            log.info("One-step pay arrear - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel);

            // Validate required parameters
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "One-Step Pay Arrear Failed", OK));
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Phone number is required"), "One-Step Pay Arrear Failed", OK));
            }

            // Execute one-step payment
            Map<String, Object> paymentResponse = integrationService.payArrearOneStep(
                    transactionId, deviceNumber, amount, phoneNumber, channel);

            return ok(getResponse(request, paymentResponse, "One-Step Arrear Payment Successful", OK));

        } catch (Exception e) {
            log.error("Error in one-step pay arrear: ", e);

            String errorMessage = e.getMessage();
            if (errorMessage.contains("Minimum payment amount")) {
                // Extract minimum amount if available
                errorMessage = "Payment amount is too low. " + errorMessage;
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage), "One-Step Pay Arrear Failed", OK));
        }
    }

    /**
     * Combined endpoint for arrear payment with flexible verify code handling
     */
    @PostMapping("/edg/payArrear")
    public ResponseEntity<Response> payArrear(@NotNull Authentication authentication,
                                              HttpServletRequest request,
                                              @RequestParam("transactionId") String transactionId,
                                              @RequestParam("deviceNumber") String deviceNumber,
                                              @RequestParam("amount") String amount,
                                              @RequestParam("phoneNumber") String phoneNumber,
                                              @RequestParam(value = "channel", defaultValue = "05") String channel,
                                              @RequestParam(value = "verifyCode", required = false) String verifyCode,
                                              @RequestParam(value = "oneStep", defaultValue = "false") boolean oneStep) {
        try {
            log.info("Pay arrear - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}, OneStep: {}, VerifyCode: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel, oneStep,
                    verifyCode != null && !verifyCode.isEmpty() ? "PROVIDED" : "EMPTY");

            // Validate required parameters
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "Pay Arrear Failed", OK));
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Phone number is required"), "Pay Arrear Failed", OK));
            }

            Map<String, Object> paymentResponse;

            if (oneStep) {
                // One-step payment
                paymentResponse = integrationService.payArrearOneStep(
                        transactionId, deviceNumber, amount, phoneNumber, channel);
            } else if (verifyCode != null && !verifyCode.trim().isEmpty()) {
                // Complete payment with verify code
                paymentResponse = integrationService.completePayArrear(
                        transactionId, deviceNumber, amount, phoneNumber, channel, verifyCode);
            } else {
                // Pre-pay
                paymentResponse = integrationService.prePayArrear(
                        transactionId, deviceNumber, amount, phoneNumber, channel);
            }

            return ok(getResponse(request, paymentResponse, "Arrear Payment Request Processed Successfully", OK));

        } catch (Exception e) {
            log.error("Error in pay arrear: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Pay Arrear Failed", OK));
        }
    }

    /**
     * Get arrear payment summary for a device
     */
    @GetMapping("/edg/arrearSummary")
    public ResponseEntity<Response> getArrearSummary(@NotNull Authentication authentication,
                                                     HttpServletRequest request,
                                                     @RequestParam("deviceNumber") String deviceNumber) {
        try {
            log.info("Getting arrear summary for device: {}", deviceNumber);

            Map<String, Object> summary = new HashMap<>();

            // Check arrears
            try {
                Map<String, Object> arrearInfo = integrationService.checkArrears(deviceNumber);
                summary.putAll(arrearInfo);

                // Get recent arrear payments if any
                try {
                    Map<String, Object> transactions = integrationService.searchSalesTransactions(deviceNumber, 5);

                    // Filter for arrear payments (you may need to adjust based on actual response)
                    if (transactions.containsKey("details") && transactions.get("details") instanceof List) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> transList = (List<Map<String, Object>>) transactions.get("details");

                        List<Map<String, Object>> arrearPayments = new ArrayList<>();
                        for (Map<String, Object> trans : transList) {
                            // Check if transaction is arrear payment (may need adjustment based on actual data)
                            arrearPayments.add(Map.of(
                                    "code", trans.getOrDefault("code", ""),
                                    "time", trans.getOrDefault("time", ""),
                                    "amount", trans.getOrDefault("amt", "")
                            ));
                        }

                        summary.put("recent_arrear_payments", arrearPayments);
                    }
                } catch (Exception e) {
                    log.debug("Could not get recent transactions: {}", e.getMessage());
                    summary.put("recent_arrear_payments", new ArrayList<>());
                }

            } catch (Exception e) {
                summary.put("error", "Could not retrieve arrear information: " + e.getMessage());
                summary.put("device", deviceNumber);
                summary.put("has_arrears", "unknown");
            }

            return ok(getResponse(request, summary, "Arrear Summary Retrieved", OK));

        } catch (Exception e) {
            log.error("Error getting arrear summary: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Get Arrear Summary Failed", OK));
        }
    }







    /**
     * Get details of a specific arrear payment transaction
     */
    @GetMapping("/edg/arrearTransactionDetails")
    public ResponseEntity<Response> getArrearTransactionDetails(@NotNull Authentication authentication,
                                                                HttpServletRequest request,
                                                                @RequestParam("transactionCode") String transactionCode) {
        try {
            log.info("Getting arrear transaction details for code: {}", transactionCode);

            // Validate parameter
            if (transactionCode == null || transactionCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Transaction code is required"),
                                "Get Arrear Transaction Details Failed", OK));
            }

            // Get transaction details
            Map<String, Object> transactionDetails = integrationService.getArrearTransactionDetails(transactionCode);

            return ok(getResponse(request, transactionDetails, "Arrear Transaction Details Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting arrear transaction details: ", e);

            String errorMessage = e.getMessage();
            if (errorMessage.contains("transaction not found")) {
                errorMessage = "Arrear transaction code not found: " + transactionCode +
                        ". Please verify the code is correct and from an arrear payment.";
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage),
                            "Get Arrear Transaction Details Failed", OK));
        }
    }

    /**
     * Search for arrear payment transactions
     */
    @GetMapping("/edg/searchArrearTransactions")
    public ResponseEntity<Response> searchArrearTransactions(@NotNull Authentication authentication,
                                                             HttpServletRequest request,
                                                             @RequestParam(value = "deviceNumber", required = false) String deviceNumber) {
        try {
            log.info("Searching arrear transactions for device: {}",
                    deviceNumber != null ? deviceNumber : "ALL");

            // Search transactions
            Map<String, Object> searchResults = integrationService.searchArrearTransactions(deviceNumber);

            return ok(getResponse(request, searchResults, "Arrear Transactions Search Successful", OK));

        } catch (Exception e) {
            log.error("Error searching arrear transactions: ", e);

            String errorMessage = e.getMessage();
            if (errorMessage.contains("No arrear transactions found")) {
                if (deviceNumber != null) {
                    errorMessage = "No arrear payment transactions found for device: " + deviceNumber;
                } else {
                    errorMessage = "No arrear payment transactions found";
                }
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage),
                            "Search Arrear Transactions Failed", OK));
        }
    }

    /**
     * Get arrear payment history with full details
     */
    @GetMapping("/edg/arrearPaymentHistory")
    public ResponseEntity<Response> getArrearPaymentHistory(@NotNull Authentication authentication,
                                                            HttpServletRequest request,
                                                            @RequestParam("deviceNumber") String deviceNumber,
                                                            @RequestParam(value = "limit", defaultValue = "5") Integer limit) {
        try {
            log.info("Getting arrear payment history for device: {}, limit: {}", deviceNumber, limit);

            // Validate parameters
            if (deviceNumber == null || deviceNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Device number is required"),
                                "Get Arrear Payment History Failed", OK));
            }

            if (limit != null && limit <= 0) {
                limit = 5; // Default to 5 detailed records
            }

            // Get history with details
            Map<String, Object> historyResults = integrationService.getArrearPaymentHistory(deviceNumber, limit);

            return ok(getResponse(request, historyResults, "Arrear Payment History Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting arrear payment history: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Get Arrear Payment History Failed", OK));
        }
    }

    /**
     * Verify an arrear payment transaction
     */
    @GetMapping("/edg/verifyArrearPayment")
    public ResponseEntity<Response> verifyArrearPayment(@NotNull Authentication authentication,
                                                        HttpServletRequest request,
                                                        @RequestParam("transactionCode") String transactionCode) {
        try {
            log.info("Verifying arrear payment transaction: {}", transactionCode);

            Map<String, Object> verificationResult = new HashMap<>();

            try {
                // Get transaction details
                Map<String, Object> details = integrationService.getArrearTransactionDetails(transactionCode);

                verificationResult.put("valid", true);
                verificationResult.put("transaction", details);

                // Extract key information for quick verification
                verificationResult.put("summary", Map.of(
                        "transactionCode", transactionCode,
                        "customerName", details.getOrDefault("name", ""),
                        "device", details.getOrDefault("device", ""),
                        "amount", details.getOrDefault("amt", ""),
                        "netAmount", details.getOrDefault("net_amt", ""),
                        "transactionTime", details.getOrDefault("trans_time", ""),
                        "commission", details.getOrDefault("comm_amt", "")
                ));

                // Extract payment details if present
                if (details.containsKey("pay_details")) {
                    verificationResult.put("payment_details", details.get("pay_details"));
                }

            } catch (Exception e) {
                verificationResult.put("valid", false);
                verificationResult.put("error", e.getMessage());
                verificationResult.put("transactionCode", transactionCode);
            }

            return ok(getResponse(request, verificationResult, "Arrear Payment Verification Complete", OK));

        } catch (Exception e) {
            log.error("Error verifying arrear payment: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Arrear Payment Verification Failed", OK));
        }
    }

    /**
     * Get recent arrear payments for a device
     */
    @GetMapping("/edg/recentArrearPayments")
    public ResponseEntity<Response> getRecentArrearPayments(@NotNull Authentication authentication,
                                                            HttpServletRequest request,
                                                            @RequestParam("deviceNumber") String deviceNumber) {
        try {
            log.info("Getting recent arrear payments for device: {}", deviceNumber);

            // Validate parameter
            if (deviceNumber == null || deviceNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Device number is required"),
                                "Get Recent Arrear Payments Failed", OK));
            }

            // Search for arrear transactions
            Map<String, Object> searchResults = integrationService.searchArrearTransactions(deviceNumber);

            Map<String, Object> recentPayments = new HashMap<>();
            recentPayments.put("device", deviceNumber);
            recentPayments.put("ref_code", searchResults.get("ref_code"));

            // Format transaction list for easier consumption
            if (searchResults.containsKey("details") && searchResults.get("details") instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> transactions = (List<Map<String, Object>>) searchResults.get("details");

                // Calculate total paid
                double totalPaid = 0.0;
                List<Map<String, Object>> formattedTransactions = new ArrayList<>();

                for (Map<String, Object> trans : transactions) {
                    Map<String, Object> formatted = Map.of(
                            "code", trans.getOrDefault("code", ""),
                            "time", trans.getOrDefault("time", ""),
                            "amount", trans.getOrDefault("amt", ""),
                            "operator", trans.getOrDefault("operator", "")
                    );
                    formattedTransactions.add(formatted);

                    try {
                        String amtStr = trans.get("amt") != null ? trans.get("amt").toString() : "0";
                        totalPaid += Double.parseDouble(amtStr);
                    } catch (NumberFormatException e) {
                        log.debug("Could not parse amount: {}", trans.get("amt"));
                    }
                }

                recentPayments.put("payments", formattedTransactions);
                recentPayments.put("count", formattedTransactions.size());
                recentPayments.put("total_paid", totalPaid);
            } else {
                recentPayments.put("payments", new ArrayList<>());
                recentPayments.put("count", 0);
                recentPayments.put("total_paid", 0.0);
            }

            return ok(getResponse(request, recentPayments, "Recent Arrear Payments Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting recent arrear payments: ", e);

            String errorMessage = e.getMessage();
            if (errorMessage.contains("No arrear transactions found")) {
                // Return empty result instead of error
                Map<String, Object> emptyResult = Map.of(
                        "device", deviceNumber,
                        "payments", new ArrayList<>(),
                        "count", 0,
                        "total_paid", 0.0,
                        "message", "No arrear payments found for this device"
                );
                return ok(getResponse(request, emptyResult, "No Arrear Payments Found", OK));
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage),
                            "Get Recent Arrear Payments Failed", OK));
        }
    }

    /**
     * Get all arrear transactions (for admin/reporting)
     */
    @GetMapping("/edg/allArrearTransactions")
    public ResponseEntity<Response> getAllArrearTransactions(@NotNull Authentication authentication,
                                                             HttpServletRequest request) {
        try {
            log.info("Getting all arrear transactions");

            // Search without device number to get all transactions
            Map<String, Object> allTransactions = integrationService.searchArrearTransactions(null);

            // Add summary statistics
            if (allTransactions.containsKey("details") && allTransactions.get("details") instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> transactions = (List<Map<String, Object>>) allTransactions.get("details");

                double totalAmount = 0.0;
                Set<String> uniqueDevices = new HashSet<>();

                for (Map<String, Object> trans : transactions) {
                    try {
                        String amtStr = trans.get("amt") != null ? trans.get("amt").toString() : "0";
                        totalAmount += Double.parseDouble(amtStr);
                    } catch (NumberFormatException e) {
                        log.debug("Could not parse amount: {}", trans.get("amt"));
                    }

                    // Count unique devices (if available in response)
                    if (trans.containsKey("device")) {
                        uniqueDevices.add(trans.get("device").toString());
                    }
                }

                allTransactions.put("summary", Map.of(
                        "total_transactions", transactions.size(),
                        "total_amount", totalAmount,
                        "unique_devices", uniqueDevices.size()
                ));
            }

            return ok(getResponse(request, allTransactions, "All Arrear Transactions Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting all arrear transactions: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Get All Arrear Transactions Failed", OK));
        }
    }









    /**
     * Get bills for a post-payment customer
     */
    @GetMapping("/edg/getBills")
    public ResponseEntity<Response> getBills(
            HttpServletRequest request,
            @RequestParam(value = "customerReference", required = false) String customerReference) {
        try {
            log.info("Getting bills for customer: {}", customerReference);

            // Validate parameter
            if (customerReference == null || customerReference.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Customer reference is required"),
                                "Get Bills Failed", OK));
            }

            // Get bills
            Map<String, Object> billsResponse = integrationService.getBills(customerReference);

            return ok(getResponse(request, billsResponse, "Bills Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting bills: ", e);

            String errorMessage = e.getMessage();
            if (errorMessage.contains("No bills found")) {
                errorMessage = "No bills found for customer: " + customerReference +
                        ". Please verify the customer reference (ID, reference, or meter number).";
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage),
                            "Get Bills Failed", OK));
        }
    }

    /**
     * Get details of a specific bill
     */
    @GetMapping("/edg/getBillDetails")
    public ResponseEntity<Response> getBillDetails(
                                                   HttpServletRequest request,
                                                   @RequestParam("billCode") String billCode) {
        try {
            log.info("Getting bill details for code: {}", billCode);

            // Validate parameter
            if (billCode == null || billCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Bill code is required"),
                                "Get Bill Details Failed", OK));
            }

            // Get bill details
            Map<String, Object> billDetails = integrationService.getBillDetails(billCode);

            return ok(getResponse(request, billDetails, "Bill Details Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting bill details: ", e);

            String errorMessage = e.getMessage();
            if (errorMessage.contains("Bill not found")) {
                errorMessage = "Bill not found: " + billCode +
                        ". Please verify the bill code format (Exp+Sn(6) or Id+BillNumber).";
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage),
                            "Get Bill Details Failed", OK));
        }
    }

    /**
     * Check unpaid bills for a customer
     */
    @GetMapping("/edg/checkUnpaidBills")
    public ResponseEntity<Response> checkUnpaidBills(@NotNull Authentication authentication,
                                                     HttpServletRequest request,
                                                     @RequestParam("customerReference") String customerReference) {
        try {
            log.info("Checking unpaid bills for customer: {}", customerReference);

            // Validate parameter
            if (customerReference == null || customerReference.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Customer reference is required"),
                                "Check Unpaid Bills Failed", OK));
            }

            // Check unpaid bills
            Map<String, Object> unpaidInfo = integrationService.checkUnpaidBills(customerReference);

            return ok(getResponse(request, unpaidInfo, "Unpaid Bills Check Successful", OK));

        } catch (Exception e) {
            log.error("Error checking unpaid bills: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Check Unpaid Bills Failed", OK));
        }
    }

    /**
     * Get bill by customer ID and bill number
     */
    @GetMapping("/edg/getBillByIdAndNumber")
    public ResponseEntity<Response> getBillByIdAndNumber(@NotNull Authentication authentication,
                                                         HttpServletRequest request,
                                                         @RequestParam("customerId") String customerId,
                                                         @RequestParam("billNumber") String billNumber) {
        try {
            log.info("Getting bill by ID: {} and number: {}", customerId, billNumber);

            // Validate parameters
            if (customerId == null || customerId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Customer ID is required"),
                                "Get Bill Failed", OK));
            }
            if (billNumber == null || billNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Bill number is required"),
                                "Get Bill Failed", OK));
            }

            // Get bill details
            Map<String, Object> billDetails = integrationService.getBillByIdAndNumber(customerId, billNumber);

            return ok(getResponse(request, billDetails, "Bill Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting bill by ID and number: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Get Bill Failed", OK));
        }
    }

    /**
     * Get customer bill summary
     */
    @GetMapping("/edg/customerBillSummary")
    public ResponseEntity<Response> getCustomerBillSummary(@NotNull Authentication authentication,
                                                           HttpServletRequest request,
                                                           @RequestParam("customerReference") String customerReference) {
        try {
            log.info("Getting bill summary for customer: {}", customerReference);

            Map<String, Object> summary = new HashMap<>();

            try {
                // Get all bills
                Map<String, Object> billsResponse = integrationService.getBills(customerReference);

                if (billsResponse.containsKey("bills") && billsResponse.get("bills") instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> bills = (List<Map<String, Object>>) billsResponse.get("bills");

                    // Extract customer info from first bill
                    if (!bills.isEmpty()) {
                        Map<String, Object> firstBill = bills.get(0);
                        summary.put("customer_id", firstBill.get("id"));
                        summary.put("customer_ref", firstBill.get("ref_code"));
                        summary.put("customer_name", firstBill.get("name"));
                    }

                    // Calculate summary statistics
                    int totalBills = bills.size();
                    int unpaidBills = 0;
                    int partiallyPaidBills = 0;
                    int paidBills = 0;
                    double totalAmount = 0.0;
                    double totalBalance = 0.0;

                    List<Map<String, Object>> billsSummary = new ArrayList<>();

                    for (Map<String, Object> bill : bills) {
                        String status = bill.get("status") != null ? bill.get("status").toString() : "";

                        // Count by status
                        switch (status) {
                            case "1":
                                unpaidBills++;
                                break;
                            case "2":
                                partiallyPaidBills++;
                                break;
                            case "3":
                                paidBills++;
                                break;
                        }

                        // Sum amounts
                        try {
                            String amtStr = bill.get("amt") != null ? bill.get("amt").toString() : "0";
                            String balanceStr = bill.get("balance") != null ? bill.get("balance").toString() : "0";
                            totalAmount += Double.parseDouble(amtStr);
                            totalBalance += Double.parseDouble(balanceStr);
                        } catch (NumberFormatException e) {
                            log.debug("Could not parse amounts");
                        }

                        // Create summary for each bill
                        Map<String, Object> billSummary = Map.of(
                                "code", bill.getOrDefault("code", ""),
                                "period", bill.getOrDefault("period", ""),
                                "amount", bill.getOrDefault("amt", ""),
                                "balance", bill.getOrDefault("balance", ""),
                                "status", getStatusText(status),
                                "date_limit", bill.getOrDefault("date_limit", "")
                        );
                        billsSummary.add(billSummary);
                    }

                    summary.put("total_bills", totalBills);
                    summary.put("unpaid_bills", unpaidBills);
                    summary.put("partially_paid_bills", partiallyPaidBills);
                    summary.put("paid_bills", paidBills);
                    summary.put("total_amount", totalAmount);
                    summary.put("total_balance", totalBalance);
                    summary.put("bills", billsSummary);
                } else {
                    summary.put("message", "No bills found for customer");
                    summary.put("customer_reference", customerReference);
                }

            } catch (Exception e) {
                summary.put("error", "Could not retrieve bill summary: " + e.getMessage());
                summary.put("customer_reference", customerReference);
            }

            return ok(getResponse(request, summary, "Customer Bill Summary Retrieved", OK));

        } catch (Exception e) {
            log.error("Error getting customer bill summary: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Get Customer Bill Summary Failed", OK));
        }
    }

    /**
     * Get overdue bills for a customer
     */
    @GetMapping("/edg/overdueBills")
    public ResponseEntity<Response> getOverdueBills(@NotNull Authentication authentication,
                                                    HttpServletRequest request,
                                                    @RequestParam("customerReference") String customerReference) {
        try {
            log.info("Getting overdue bills for customer: {}", customerReference);

            Map<String, Object> overdueInfo = new HashMap<>();
            overdueInfo.put("customer_reference", customerReference);

            try {
                // Get all bills
                Map<String, Object> billsResponse = integrationService.getBills(customerReference);

                if (billsResponse.containsKey("bills") && billsResponse.get("bills") instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> bills = (List<Map<String, Object>>) billsResponse.get("bills");

                    List<Map<String, Object>> overdueBills = new ArrayList<>();
                    double totalOverdue = 0.0;

                    // Current date for comparison
                    java.time.LocalDate today = java.time.LocalDate.now();
                    java.time.format.DateTimeFormatter formatter =
                            java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

                    for (Map<String, Object> bill : bills) {
                        String status = bill.get("status") != null ? bill.get("status").toString() : "";
                        String dateLimitStr = bill.get("date_limit") != null ? bill.get("date_limit").toString() : "";

                        // Only check unpaid or partially paid bills
                        if (("1".equals(status) || "2".equals(status)) && !dateLimitStr.isEmpty()) {
                            try {
                                java.time.LocalDate dueDate = java.time.LocalDate.parse(
                                        dateLimitStr.split(" ")[0]
                                );

                                if (dueDate.isBefore(today)) {
                                    overdueBills.add(bill);
                                    String balanceStr = bill.get("balance") != null ?
                                            bill.get("balance").toString() : "0";
                                    totalOverdue += Double.parseDouble(balanceStr);
                                }
                            } catch (Exception e) {
                                log.debug("Could not parse date: {}", dateLimitStr);
                            }
                        }
                    }

                    overdueInfo.put("has_overdue", !overdueBills.isEmpty());
                    overdueInfo.put("overdue_count", overdueBills.size());
                    overdueInfo.put("total_overdue", totalOverdue);
                    overdueInfo.put("overdue_bills", overdueBills);
                } else {
                    overdueInfo.put("has_overdue", false);
                    overdueInfo.put("overdue_count", 0);
                    overdueInfo.put("total_overdue", 0.0);
                    overdueInfo.put("overdue_bills", new ArrayList<>());
                }

            } catch (Exception e) {
                overdueInfo.put("error", "Could not check overdue bills: " + e.getMessage());
            }

            return ok(getResponse(request, overdueInfo, "Overdue Bills Retrieved", OK));

        } catch (Exception e) {
            log.error("Error getting overdue bills: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Get Overdue Bills Failed", OK));
        }
    }





    /**
     * Pre-pay bill endpoint
     */
    @PostMapping("/edg/prePayBill")
    public ResponseEntity<Response> prePayBill(@NotNull Authentication authentication,
                                               HttpServletRequest request,
                                               @RequestParam("transactionId") String transactionId,
                                               @RequestParam("billCode") String billCode,
                                               @RequestParam("amount") String amount,
                                               @RequestParam("phoneNumber") String phoneNumber,
                                               @RequestParam(value = "channel", defaultValue = "05") String channel) {
        try {
            log.info("Pre-pay bill - TransID: {}, BillCode: {}, Amount: {}, Phone: {}, Channel: {}",
                    transactionId, billCode, amount, phoneNumber, channel);

            // Validate required parameters
            if (billCode == null || billCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Bill code is required"), "Pre-Pay Bill Failed", OK));
            }
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "Pre-Pay Bill Failed", OK));
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Phone number is required"), "Pre-Pay Bill Failed", OK));
            }

            // Call pre-pay service
            Map<String, Object> prePayResponse = integrationService.prePayBill(
                    transactionId, billCode, amount, phoneNumber, channel);

            return ok(getResponse(request, prePayResponse, "Pre-Pay Bill Successful", OK));

        } catch (Exception e) {
            log.error("Error in pre-pay bill: ", e);

            String errorMessage = e.getMessage();
            if (errorMessage.contains("Bill not found")) {
                errorMessage = "Bill not found. Please verify the bill code is correct.";
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage), "Pre-Pay Bill Failed", OK));
        }
    }

    /**
     * Complete bill payment endpoint
     */
    @PostMapping("/edg/completePayBill")
    public ResponseEntity<Response> completePayBill(@NotNull Authentication authentication,
                                                    HttpServletRequest request,
                                                    @RequestParam("transactionId") String transactionId,
                                                    @RequestParam("billCode") String billCode,
                                                    @RequestParam("amount") String amount,
                                                    @RequestParam("phoneNumber") String phoneNumber,
                                                    @RequestParam("verifyCode") String verifyCode,
                                                    @RequestParam(value = "channel", defaultValue = "05") String channel) {
        try {
            log.info("Complete pay bill - TransID: {}, BillCode: {}, Amount: {}, Phone: {}, Channel: {}, VerifyCode: {}",
                    transactionId, billCode, amount, phoneNumber, channel,
                    verifyCode != null && !verifyCode.isEmpty() ? "PROVIDED" : "MISSING");

            // Validate required parameters
            if (billCode == null || billCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Bill code is required"), "Complete Pay Bill Failed", OK));
            }
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "Complete Pay Bill Failed", OK));
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Phone number is required"), "Complete Pay Bill Failed", OK));
            }
            if (verifyCode == null || verifyCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Verify code is required"), "Complete Pay Bill Failed", OK));
            }

            // Complete the payment
            Map<String, Object> paymentResponse = integrationService.completePayBill(
                    transactionId, billCode, amount, phoneNumber, channel, verifyCode);

            return ok(getResponse(request, paymentResponse, "Bill Payment Completed Successfully", OK));

        } catch (Exception e) {
            log.error("Error completing pay bill: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Complete Pay Bill Failed", OK));
        }
    }

    /**
     * One-step bill payment endpoint (bypasses pre-pay verification)
     */
    @PostMapping("/edg/payBillOneStep")
    public ResponseEntity<Response> payBillOneStep(@NotNull Authentication authentication,
                                                   HttpServletRequest request,
                                                   @RequestParam("transactionId") String transactionId,
                                                   @RequestParam("billCode") String billCode,
                                                   @RequestParam("amount") String amount,
                                                   @RequestParam("phoneNumber") String phoneNumber,
                                                   @RequestParam(value = "channel", defaultValue = "05") String channel) {
        try {
            log.info("One-step pay bill - TransID: {}, BillCode: {}, Amount: {}, Phone: {}, Channel: {}",
                    transactionId, billCode, amount, phoneNumber, channel);

            // Validate required parameters
            if (billCode == null || billCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Bill code is required"), "One-Step Pay Bill Failed", OK));
            }
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "One-Step Pay Bill Failed", OK));
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Phone number is required"), "One-Step Pay Bill Failed", OK));
            }

            // Execute one-step payment
            Map<String, Object> paymentResponse = integrationService.payBillOneStep(
                    transactionId, billCode, amount, phoneNumber, channel);

            return ok(getResponse(request, paymentResponse, "One-Step Bill Payment Successful", OK));

        } catch (Exception e) {
            log.error("Error in one-step pay bill: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "One-Step Pay Bill Failed", OK));
        }
    }

    /**
     * Combined endpoint for bill payment with flexible verify code handling
     */
    @PostMapping("/edg/payBill")
    public ResponseEntity<Response> payBill(@NotNull Authentication authentication,
                                            HttpServletRequest request,
                                            @RequestParam("transactionId") String transactionId,
                                            @RequestParam("billCode") String billCode,
                                            @RequestParam("amount") String amount,
                                            @RequestParam("phoneNumber") String phoneNumber,
                                            @RequestParam(value = "channel", defaultValue = "05") String channel,
                                            @RequestParam(value = "verifyCode", required = false) String verifyCode,
                                            @RequestParam(value = "oneStep", defaultValue = "false") boolean oneStep) {
        try {
            log.info("Pay bill - TransID: {}, BillCode: {}, Amount: {}, Phone: {}, Channel: {}, OneStep: {}, VerifyCode: {}",
                    transactionId, billCode, amount, phoneNumber, channel, oneStep,
                    verifyCode != null && !verifyCode.isEmpty() ? "PROVIDED" : "EMPTY");

            // Validate required parameters
            if (billCode == null || billCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Bill code is required"), "Pay Bill Failed", OK));
            }
            if (amount == null || amount.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Amount is required"), "Pay Bill Failed", OK));
            }
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Phone number is required"), "Pay Bill Failed", OK));
            }

            Map<String, Object> paymentResponse;

            if (oneStep) {
                // One-step payment
                paymentResponse = integrationService.payBillOneStep(
                        transactionId, billCode, amount, phoneNumber, channel);
            } else if (verifyCode != null && !verifyCode.trim().isEmpty()) {
                // Complete payment with verify code
                paymentResponse = integrationService.completePayBill(
                        transactionId, billCode, amount, phoneNumber, channel, verifyCode);
            } else {
                // Pre-pay
                paymentResponse = integrationService.prePayBill(
                        transactionId, billCode, amount, phoneNumber, channel);
            }

            return ok(getResponse(request, paymentResponse, "Bill Payment Request Processed Successfully", OK));

        } catch (Exception e) {
            log.error("Error in pay bill: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()), "Pay Bill Failed", OK));
        }
    }

    /**
     * Get details of a specific bill payment transaction
     */
    @GetMapping("/edg/billTransactionDetails")
    public ResponseEntity<Response> getBillTransactionDetails(@NotNull Authentication authentication,
                                                              HttpServletRequest request,
                                                              @RequestParam("transactionCode") String transactionCode) {
        try {
            log.info("Getting bill transaction details for code: {}", transactionCode);

            // Validate parameter
            if (transactionCode == null || transactionCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(getResponse(request, Map.of("error", "Transaction code is required"),
                                "Get Bill Transaction Details Failed", OK));
            }

            // Get transaction details
            Map<String, Object> transactionDetails = integrationService.getBillTransactionDetails(transactionCode);

            return ok(getResponse(request, transactionDetails, "Bill Transaction Details Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting bill transaction details: ", e);

            String errorMessage = e.getMessage();
            if (errorMessage.contains("transaction not found")) {
                errorMessage = "Bill transaction code not found: " + transactionCode +
                        ". Please verify the code is correct and from a bill payment.";
            }

            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", errorMessage),
                            "Get Bill Transaction Details Failed", OK));
        }
    }

    /**
     * Search for bill payment transactions
     */
    @GetMapping("/edg/searchBillTransactions")
    public ResponseEntity<Response> searchBillTransactions(@NotNull Authentication authentication,
                                                           HttpServletRequest request,
                                                           @RequestParam(value = "searchCode", required = false) String searchCode) {
        try {
            log.info("Searching bill transactions for code: {}",
                    searchCode != null ? searchCode : "ALL");

            // Search transactions
            Map<String, Object> searchResults = integrationService.searchBillTransactions(searchCode);

            return ok(getResponse(request, searchResults, "Bill Transactions Search Successful", OK));

        } catch (Exception e) {
            log.error("Error searching bill transactions: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Search Bill Transactions Failed", OK));
        }
    }

    /**
     * Get bill payment history with full details
     */
    @GetMapping("/edg/billPaymentHistory")
    public ResponseEntity<Response> getBillPaymentHistory(@NotNull Authentication authentication,
                                                          HttpServletRequest request,
                                                          @RequestParam(value = "searchCode", required = false) String searchCode,
                                                          @RequestParam(value = "limit", defaultValue = "5") Integer limit) {
        try {
            log.info("Getting bill payment history for code: {}, limit: {}", searchCode, limit);

            if (limit != null && limit <= 0) {
                limit = 5; // Default to 5 detailed records
            }

            // Get history with details
            Map<String, Object> historyResults = integrationService.getBillPaymentHistory(searchCode, limit);

            return ok(getResponse(request, historyResults, "Bill Payment History Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting bill payment history: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Get Bill Payment History Failed", OK));
        }
    }

    /**
     * Verify a bill payment transaction
     */
    @GetMapping("/edg/verifyBillPayment")
    public ResponseEntity<Response> verifyBillPayment(@NotNull Authentication authentication,
                                                      HttpServletRequest request,
                                                      @RequestParam("transactionCode") String transactionCode) {
        try {
            log.info("Verifying bill payment transaction: {}", transactionCode);

            Map<String, Object> verificationResult = new HashMap<>();

            try {
                // Get transaction details
                Map<String, Object> details = integrationService.getBillTransactionDetails(transactionCode);

                verificationResult.put("valid", true);
                verificationResult.put("transaction", details);

                // Extract key information for quick verification
                verificationResult.put("summary", Map.of(
                        "transactionCode", transactionCode,
                        "customerName", details.getOrDefault("name", ""),
                        "customerId", details.getOrDefault("id", ""),
                        "billCode", details.getOrDefault("bill_code", ""),
                        "amount", details.getOrDefault("amt", ""),
                        "transactionTime", details.getOrDefault("trans_time", ""),
                        "paymentTimes", details.getOrDefault("pay_time", "")
                ));

            } catch (Exception e) {
                verificationResult.put("valid", false);
                verificationResult.put("error", e.getMessage());
                verificationResult.put("transactionCode", transactionCode);
            }

            return ok(getResponse(request, verificationResult, "Bill Payment Verification Complete", OK));

        } catch (Exception e) {
            log.error("Error verifying bill payment: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Bill Payment Verification Failed", OK));
        }
    }

    /**
     * Get recent bill payments
     */
    @GetMapping("/edg/recentBillPayments")
    public ResponseEntity<Response> getRecentBillPayments(@NotNull Authentication authentication,
                                                          HttpServletRequest request,
                                                          @RequestParam(value = "searchCode", required = false) String searchCode) {
        try {
            log.info("Getting recent bill payments for code: {}", searchCode);

            // Search for bill transactions
            Map<String, Object> searchResults = integrationService.searchBillTransactions(searchCode);

            Map<String, Object> recentPayments = new HashMap<>();

            // Format transaction list for easier consumption
            if (searchResults.containsKey("details") && searchResults.get("details") instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> transactions = (List<Map<String, Object>>) searchResults.get("details");

                // Calculate total paid
                double totalPaid = 0.0;
                List<Map<String, Object>> formattedTransactions = new ArrayList<>();

                for (Map<String, Object> trans : transactions) {
                    Map<String, Object> formatted = Map.of(
                            "transactionCode", trans.getOrDefault("trans_code", ""),
                            "transactionTime", trans.getOrDefault("trans_time", ""),
                            "billCode", trans.getOrDefault("bill_code", ""),
                            "customerId", trans.getOrDefault("id", ""),
                            "amount", trans.getOrDefault("amt", ""),
                            "paymentTimes", trans.getOrDefault("pay_times", ""),
                            "operator", trans.getOrDefault("operator", "")
                    );
                    formattedTransactions.add(formatted);

                    try {
                        String amtStr = trans.get("amt") != null ? trans.get("amt").toString() : "0";
                        totalPaid += Double.parseDouble(amtStr);
                    } catch (NumberFormatException e) {
                        log.debug("Could not parse amount: {}", trans.get("amt"));
                    }
                }

                recentPayments.put("payments", formattedTransactions);
                recentPayments.put("count", formattedTransactions.size());
                recentPayments.put("total_paid", totalPaid);
            } else {
                recentPayments.put("payments", new ArrayList<>());
                recentPayments.put("count", 0);
                recentPayments.put("total_paid", 0.0);
            }

            if (searchCode != null) {
                recentPayments.put("search_code", searchCode);
            }

            return ok(getResponse(request, recentPayments, "Recent Bill Payments Retrieved Successfully", OK));

        } catch (Exception e) {
            log.error("Error getting recent bill payments: ", e);
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Get Recent Bill Payments Failed", OK));
        }
    }

    // Helper method
    private String getStatusText(String status) {
        switch (status) {
            case "1": return "Non-payment";
            case "2": return "In payment";
            case "3": return "Paid";
            default: return "Unknown";
        }
    }
    private URI getUri() {
        return URI.create("/integration");
    }

}