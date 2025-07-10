package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.service.IntegrationService;
import io.digiservices.ecreditservice.utils.IntegrationUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class IntegrationServiceImpl implements IntegrationService {

    private final IntegrationUtils integrationUtils;

    @Override
    public Map<String, Object> getVerifyCode() {
        try {
            log.info("Service: Getting verify code token");
            return integrationUtils.getVerifyCode();
        } catch (Exception e) {
            log.error("Service: Error getting verify code", e);
            throw new RuntimeException("Failed to get verify code: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> getAccountDetails() {
        try {
            log.info("Service: Getting account details");
            return integrationUtils.getAccountDetail();
        } catch (Exception e) {
            log.error("Service: Error getting account details", e);
            throw new RuntimeException("Failed to get account details: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> getCompleteAccountInfo() {
        try {
            log.info("Service: Getting complete account information");

            // First get the token
            Map<String, Object> tokenResponse = getVerifyCode();

            // Then get account details
            Map<String, Object> accountResponse = getAccountDetails();

            // Combine responses
            Map<String, Object> completeResponse = new java.util.HashMap<>(accountResponse);
            completeResponse.put("token_info", tokenResponse);

            return completeResponse;

        } catch (Exception e) {
            log.error("Service: Error getting complete account info", e);
            throw new RuntimeException("Failed to get complete account info: " + e.getMessage(), e);
        }
    }

    @Override
    public void clearToken() {
        log.info("Service: Clearing stored token");
        integrationUtils.clearToken();
    }

    @Override
    public String getCurrentTokenStatus() {
        String token = integrationUtils.getCurrentToken();
        return token != null ? "Token available" : "No token available";
    }

    @Override
    public Map<String, Object> transferAmount(String transactionId, String recipientCode, String amount) {
        try {
            log.info("Service: Transferring amount - TransID: {}, Recipient: {}, Amount: {}", transactionId, recipientCode, amount);
            return integrationUtils.transferAmount(transactionId, recipientCode, amount);
        } catch (Exception e) {
            log.error("Service: Error transferring amount", e);
            throw new RuntimeException("Failed to transfer amount: " + e.getMessage(), e);
        }
    }


    /**
     * Get customer details from partner API (with automatic token retrieval)
     */
    @Override
    public Map<String, Object> getCustomerDetails(String customerReference) {
        try {
            log.info("Service: Getting customer details for reference: {}", customerReference);
            return integrationUtils.getCustomerDetails(customerReference);
        } catch (Exception e) {
            log.error("Service: Error getting customer details", e);
            throw new RuntimeException("Failed to get customer details: " + e.getMessage(), e);
        }
    }




    @Override
    public Map<String, Object> preSalePower(String transactionId, String deviceNumber, String amount,
                                            String phoneNumber, String channel) {
        try {
            log.info("Service: Pre-sale power - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel);

            // Pre-sale with empty verify code
            return integrationUtils.salePower(transactionId, deviceNumber, amount, phoneNumber, channel, "");

        } catch (Exception e) {
            log.error("Service: Error in pre-sale power", e);
            throw new RuntimeException("Failed to pre-sale power: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> completeSalePower(String transactionId, String deviceNumber, String amount,
                                                 String phoneNumber, String channel, String verifyCode) {
        try {
            log.info("Service: Complete sale power - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}, VerifyCode: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel,
                    verifyCode != null && !verifyCode.isEmpty() ? "PROVIDED" : "MISSING");

            if (verifyCode == null || verifyCode.isEmpty()) {
                throw new IllegalArgumentException("Verify code is required to complete sale");
            }

            return integrationUtils.salePower(transactionId, deviceNumber, amount, phoneNumber, channel, verifyCode);

        } catch (Exception e) {
            log.error("Service: Error completing sale power", e);
            throw new RuntimeException("Failed to complete sale power: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> salePowerOneStep(String transactionId, String deviceNumber, String amount,
                                                String phoneNumber, String channel) {
        try {
            log.info("Service: One-step sale power - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel);

            // One-step sale with DONOTVERIFYDATA
            return integrationUtils.salePower(transactionId, deviceNumber, amount, phoneNumber, channel, "DONOTVERIFYDATA");

        } catch (Exception e) {
            log.error("Service: Error in one-step sale power", e);
            throw new RuntimeException("Failed to one-step sale power: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> getSalesTransactionDetails(String transactionCode) throws Exception {
        return integrationUtils.getSalesTransactionDetails(transactionCode);
    }

    @Override
    public Map<String, Object> searchSalesTransactions(String deviceNumber, Integer count) throws Exception {
        return integrationUtils.searchSalesTransactions(deviceNumber,count);
    }


    @Override
    public Map<String, Object> prePayArrear(String transactionId, String deviceNumber, String amount,
                                            String phoneNumber, String channel) {
        try {
            log.info("Service: Pre-pay arrear - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel);

            // Pre-pay with empty verify code
            return integrationUtils.payArrear(transactionId, deviceNumber, amount, phoneNumber, channel, "");

        } catch (Exception e) {
            log.error("Service: Error in pre-pay arrear", e);
            throw new RuntimeException("Failed to pre-pay arrear: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> completePayArrear(String transactionId, String deviceNumber, String amount,
                                                 String phoneNumber, String channel, String verifyCode) {
        try {
            log.info("Service: Complete pay arrear - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}, VerifyCode: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel,
                    verifyCode != null && !verifyCode.isEmpty() ? "PROVIDED" : "MISSING");

            if (verifyCode == null || verifyCode.isEmpty()) {
                throw new IllegalArgumentException("Verify code is required to complete arrear payment");
            }

            return integrationUtils.payArrear(transactionId, deviceNumber, amount, phoneNumber, channel, verifyCode);

        } catch (Exception e) {
            log.error("Service: Error completing pay arrear", e);
            throw new RuntimeException("Failed to complete arrear payment: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> payArrearOneStep(String transactionId, String deviceNumber, String amount,
                                                String phoneNumber, String channel) {
        try {
            log.info("Service: One-step pay arrear - TransID: {}, Device: {}, Amount: {}, Phone: {}, Channel: {}",
                    transactionId, deviceNumber, amount, phoneNumber, channel);

            // One-step payment with DONOTVERIFYDATA
            return integrationUtils.payArrear(transactionId, deviceNumber, amount, phoneNumber, channel, "DONOTVERIFYDATA");

        } catch (Exception e) {
            log.error("Service: Error in one-step pay arrear", e);
            throw new RuntimeException("Failed to one-step pay arrear: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> checkArrears(String deviceNumber) {
        try {
            log.info("Service: Checking arrears for device: {}", deviceNumber);

            if (deviceNumber == null || deviceNumber.trim().isEmpty()) {
                throw new IllegalArgumentException("Device number is required");
            }

            return integrationUtils.checkArrears(deviceNumber);

        } catch (Exception e) {
            log.error("Service: Error checking arrears", e);
            throw new RuntimeException("Failed to check arrears: " + e.getMessage(), e);
        }
    }




    @Override
    public Map<String, Object> getArrearTransactionDetails(String transactionCode) {
        try {
            log.info("Service: Getting arrear transaction details for code: {}", transactionCode);

            if (transactionCode == null || transactionCode.trim().isEmpty()) {
                throw new IllegalArgumentException("Transaction code is required");
            }

            return integrationUtils.getArrearTransactionDetails(transactionCode);

        } catch (Exception e) {
            log.error("Service: Error getting arrear transaction details", e);
            throw new RuntimeException("Failed to get arrear transaction details: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> searchArrearTransactions(String deviceNumber) {
        try {
            log.info("Service: Searching arrear transactions for device: {}",
                    deviceNumber != null ? deviceNumber : "ALL");

            return integrationUtils.searchArrearTransactions(deviceNumber);

        } catch (Exception e) {
            log.error("Service: Error searching arrear transactions", e);
            throw new RuntimeException("Failed to search arrear transactions: " + e.getMessage(), e);
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> getArrearPaymentHistory(String deviceNumber, Integer limit) {
        try {
            log.info("Service: Getting arrear payment history for device: {}, limit: {}", deviceNumber, limit);

            // First search for arrear transactions
            Map<String, Object> searchResult = searchArrearTransactions(deviceNumber);

            // Extract transaction list
            List<Map<String, Object>> transactions = new ArrayList<>();
            if (searchResult.containsKey("details") && searchResult.get("details") instanceof List) {
                List<Map<String, Object>> transactionList = (List<Map<String, Object>>) searchResult.get("details");

                // Get detailed information for each transaction (limit to prevent too many API calls)
                int maxDetails = (limit != null && limit > 0 && limit < transactionList.size()) ?
                        limit : Math.min(transactionList.size(), 5);

                for (int i = 0; i < maxDetails; i++) {
                    Map<String, Object> trans = transactionList.get(i);
                    String code = (String) trans.get("code");

                    if (code != null && !code.isEmpty()) {
                        try {
                            log.info("Getting details for arrear transaction code: {}", code);
                            Map<String, Object> details = getArrearTransactionDetails(code);

                            // Merge basic info with detailed info
                            Map<String, Object> fullTransaction = new HashMap<>(trans);
                            fullTransaction.putAll(details);
                            transactions.add(fullTransaction);

                        } catch (Exception e) {
                            log.warn("Could not get details for arrear transaction {}: {}", code, e.getMessage());
                            // Add transaction with basic info only
                            transactions.add(trans);
                        }
                    }
                }

                // Add remaining transactions without details if any
                for (int i = maxDetails; i < transactionList.size(); i++) {
                    transactions.add(transactionList.get(i));
                }
            }

            Map<String, Object> result = new HashMap<>(searchResult);
            result.put("detailed_transactions", transactions);
            result.put("details_retrieved", transactions.size());

            // Calculate total arrears paid
            double totalPaid = 0.0;
            for (Map<String, Object> trans : transactions) {
                try {
                    String amtStr = trans.get("amt") != null ? trans.get("amt").toString() : "0";
                    totalPaid += Double.parseDouble(amtStr);
                } catch (NumberFormatException e) {
                    log.debug("Could not parse amount: {}", trans.get("amt"));
                }
            }
            result.put("total_arrears_paid", totalPaid);

            return result;

        } catch (Exception e) {
            log.error("Service: Error getting arrear payment history", e);
            throw new RuntimeException("Failed to get arrear payment history: " + e.getMessage(), e);
        }
    }



    @Override
    public Map<String, Object> getBills(String customerReference) {
        try {
            log.info("Service: Getting bills for customer: {}", customerReference);

            if (customerReference == null || customerReference.trim().isEmpty()) {
                throw new IllegalArgumentException("Customer reference is required");
            }

            return integrationUtils.getBills(customerReference);

        } catch (Exception e) {
            log.error("Service: Error getting bills", e);
            throw new RuntimeException("Failed to get bills: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> getBillDetails(String billCode) {
        try {
            log.info("Service: Getting bill details for code: {}", billCode);

            if (billCode == null || billCode.trim().isEmpty()) {
                throw new IllegalArgumentException("Bill code is required");
            }

            return integrationUtils.getBillDetails(billCode);

        } catch (Exception e) {
            log.error("Service: Error getting bill details", e);
            throw new RuntimeException("Failed to get bill details: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> checkUnpaidBills(String customerReference) {
        try {
            log.info("Service: Checking unpaid bills for customer: {}", customerReference);

            if (customerReference == null || customerReference.trim().isEmpty()) {
                throw new IllegalArgumentException("Customer reference is required");
            }

            return integrationUtils.checkUnpaidBills(customerReference);

        } catch (Exception e) {
            log.error("Service: Error checking unpaid bills", e);
            throw new RuntimeException("Failed to check unpaid bills: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> getBillByIdAndNumber(String customerId, String billNumber) {
        try {
            log.info("Service: Getting bill by ID: {} and number: {}", customerId, billNumber);

            if (customerId == null || customerId.trim().isEmpty()) {
                throw new IllegalArgumentException("Customer ID is required");
            }
            if (billNumber == null || billNumber.trim().isEmpty()) {
                throw new IllegalArgumentException("Bill number is required");
            }

            // Construct bill code from ID + Bill Number
            String billCode = customerId + billNumber;

            return integrationUtils.getBillDetails(billCode);

        } catch (Exception e) {
            log.error("Service: Error getting bill by ID and number", e);
            throw new RuntimeException("Failed to get bill: " + e.getMessage(), e);
        }
    }




    @Override
    public Map<String, Object> prePayBill(String transactionId, String billCode, String amount,
                                          String phoneNumber, String channel) {
        try {
            log.info("Service: Pre-pay bill - TransID: {}, BillCode: {}, Amount: {}, Phone: {}, Channel: {}",
                    transactionId, billCode, amount, phoneNumber, channel);

            // Pre-pay with empty verify code
            return integrationUtils.payBill(transactionId, billCode, amount, phoneNumber, channel, "");

        } catch (Exception e) {
            log.error("Service: Error in pre-pay bill", e);
            throw new RuntimeException("Failed to pre-pay bill: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> completePayBill(String transactionId, String billCode, String amount,
                                               String phoneNumber, String channel, String verifyCode) {
        try {
            log.info("Service: Complete pay bill - TransID: {}, BillCode: {}, Amount: {}, Phone: {}, Channel: {}, VerifyCode: {}",
                    transactionId, billCode, amount, phoneNumber, channel,
                    verifyCode != null && !verifyCode.isEmpty() ? "PROVIDED" : "MISSING");

            if (verifyCode == null || verifyCode.isEmpty()) {
                throw new IllegalArgumentException("Verify code is required to complete bill payment");
            }

            return integrationUtils.payBill(transactionId, billCode, amount, phoneNumber, channel, verifyCode);

        } catch (Exception e) {
            log.error("Service: Error completing pay bill", e);
            throw new RuntimeException("Failed to complete bill payment: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> payBillOneStep(String transactionId, String billCode, String amount,
                                              String phoneNumber, String channel) {
        try {
            log.info("Service: One-step pay bill - TransID: {}, BillCode: {}, Amount: {}, Phone: {}, Channel: {}",
                    transactionId, billCode, amount, phoneNumber, channel);

            // One-step payment with DONOTVERIFYDATA
            return integrationUtils.payBill(transactionId, billCode, amount, phoneNumber, channel, "DONOTVERIFYDATA");

        } catch (Exception e) {
            log.error("Service: Error in one-step pay bill", e);
            throw new RuntimeException("Failed to one-step pay bill: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> getBillTransactionDetails(String transactionCode) {
        try {
            log.info("Service: Getting bill transaction details for code: {}", transactionCode);

            if (transactionCode == null || transactionCode.trim().isEmpty()) {
                throw new IllegalArgumentException("Transaction code is required");
            }

            return integrationUtils.getBillTransactionDetails(transactionCode);

        } catch (Exception e) {
            log.error("Service: Error getting bill transaction details", e);
            throw new RuntimeException("Failed to get bill transaction details: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> searchBillTransactions(String searchCode) {
        try {
            log.info("Service: Searching bill transactions for code: {}",
                    searchCode != null ? searchCode : "ALL");

            return integrationUtils.searchBillTransactions(searchCode);

        } catch (Exception e) {
            log.error("Service: Error searching bill transactions", e);
            throw new RuntimeException("Failed to search bill transactions: " + e.getMessage(), e);
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> getBillPaymentHistory(String searchCode, Integer limit) {
        try {
            log.info("Service: Getting bill payment history for code: {}, limit: {}", searchCode, limit);

            // First search for transactions
            Map<String, Object> searchResult = searchBillTransactions(searchCode);

            // Extract transaction list
            List<Map<String, Object>> transactions = new ArrayList<>();
            if (searchResult.containsKey("details") && searchResult.get("details") instanceof List) {
                List<Map<String, Object>> transactionList = (List<Map<String, Object>>) searchResult.get("details");

                // Get detailed information for each transaction (limit to prevent too many API calls)
                int maxDetails = (limit != null && limit > 0 && limit < transactionList.size()) ?
                        limit : Math.min(transactionList.size(), 5);

                for (int i = 0; i < maxDetails; i++) {
                    Map<String, Object> trans = transactionList.get(i);
                    String code = (String) trans.get("trans_code");

                    if (code != null && !code.isEmpty()) {
                        try {
                            log.info("Getting details for bill transaction code: {}", code);
                            Map<String, Object> details = getBillTransactionDetails(code);

                            // Merge basic info with detailed info
                            Map<String, Object> fullTransaction = new HashMap<>(trans);
                            fullTransaction.putAll(details);
                            transactions.add(fullTransaction);

                        } catch (Exception e) {
                            log.warn("Could not get details for bill transaction {}: {}", code, e.getMessage());
                            // Add transaction with basic info only
                            transactions.add(trans);
                        }
                    }
                }

                // Add remaining transactions without details if any
                for (int i = maxDetails; i < transactionList.size(); i++) {
                    transactions.add(transactionList.get(i));
                }
            }

            Map<String, Object> result = new HashMap<>(searchResult);
            result.put("detailed_transactions", transactions);
            result.put("details_retrieved", transactions.size());

            // Calculate total paid
            double totalPaid = 0.0;
            for (Map<String, Object> trans : transactions) {
                try {
                    String amtStr = trans.get("amt") != null ? trans.get("amt").toString() : "0";
                    totalPaid += Double.parseDouble(amtStr);
                } catch (NumberFormatException e) {
                    log.debug("Could not parse amount: {}", trans.get("amt"));
                }
            }
            result.put("total_paid", totalPaid);

            return result;

        } catch (Exception e) {
            log.error("Service: Error getting bill payment history", e);
            throw new RuntimeException("Failed to get bill payment history: " + e.getMessage(), e);
        }
    }

}
