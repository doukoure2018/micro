package io.digiservices.ecreditservice.service;

import java.util.Map;

public interface IntegrationService {

     Map<String, Object> getVerifyCode();

    Map<String, Object> getAccountDetails();

    Map<String, Object> getCustomerDetails(String customerReference);

    Map<String, Object> getCompleteAccountInfo();

    void clearToken();

    String getCurrentTokenStatus();

    Map<String, Object> transferAmount(String transactionId, String recipientCode, String amount);





    /**
     * Pre-sale power payment to get transaction details
     * @param transactionId Transaction ID
     * @param deviceNumber Device number or reference
     * @param amount Sales amount
     * @param phoneNumber Customer phone number
     * @param channel Vending channel (01:USSD, 02:SMS, 03:APP, 04:Vending Client, 05:Web Site)
     * @return Pre-sale response with verify code
     */
    Map<String, Object> preSalePower(String transactionId, String deviceNumber, String amount,
                                     String phoneNumber, String channel);

    /**
     * Complete power sale with verify code from pre-sale
     * @param transactionId Transaction ID
     * @param deviceNumber Device number or reference
     * @param amount Sales amount
     * @param phoneNumber Customer phone number
     * @param channel Vending channel
     * @param verifyCode Verify code from pre-sale response
     * @return Sale response with tokens
     */
    Map<String, Object> completeSalePower(String transactionId, String deviceNumber, String amount,
                                          String phoneNumber, String channel, String verifyCode);

    /**
     * One-step power sale (skip pre-sale verification)
     * @param transactionId Transaction ID
     * @param deviceNumber Device number or reference
     * @param amount Sales amount
     * @param phoneNumber Customer phone number
     * @param channel Vending channel
     * @return Sale response with tokens
     */
    Map<String, Object> salePowerOneStep(String transactionId, String deviceNumber, String amount,
                                         String phoneNumber, String channel);

    Map<String, Object> getSalesTransactionDetails(String transactionCode) throws Exception;
    Map<String, Object> searchSalesTransactions(String deviceNumber, Integer count) throws Exception;


    /**
     * Pre-pay arrear to get payment details
     * @param transactionId Transaction ID
     * @param deviceNumber Device number or reference
     * @param amount Payment amount
     * @param phoneNumber Customer phone number
     * @param channel Vending channel (01:USSD, 02:SMS, 03:APP, 04:Vending Client, 05:Web Site)
     * @return Pre-pay response with verify code
     */
    Map<String, Object> prePayArrear(String transactionId, String deviceNumber, String amount,
                                     String phoneNumber, String channel);

    /**
     * Complete arrear payment with verify code from pre-pay
     * @param transactionId Transaction ID
     * @param deviceNumber Device number or reference
     * @param amount Payment amount
     * @param phoneNumber Customer phone number
     * @param channel Vending channel
     * @param verifyCode Verify code from pre-pay response
     * @return Payment response with transaction code
     */
    Map<String, Object> completePayArrear(String transactionId, String deviceNumber, String amount,
                                          String phoneNumber, String channel, String verifyCode);

    /**
     * One-step arrear payment (skip pre-pay verification)
     * @param transactionId Transaction ID
     * @param deviceNumber Device number or reference
     * @param amount Payment amount
     * @param phoneNumber Customer phone number
     * @param channel Vending channel
     * @return Payment response with transaction code
     */
    Map<String, Object> payArrearOneStep(String transactionId, String deviceNumber, String amount,
                                         String phoneNumber, String channel);

    /**
     * Check if customer has arrears
     * @param deviceNumber Device number or reference
     * @return Arrear information
     */
    Map<String, Object> checkArrears(String deviceNumber);



    /**
     * Get details of a specific arrear payment transaction
     * @param transactionCode The transaction code from an arrear payment
     * @return Transaction details including payment info, customer info, etc.
     */
    Map<String, Object> getArrearTransactionDetails(String transactionCode);

    /**
     * Search for arrear payment transactions
     * @param deviceNumber Device number or customer reference (optional - null for all)
     * @return List of arrear transactions
     */
    Map<String, Object> searchArrearTransactions(String deviceNumber);

    /**
     * Get arrear payment history with full details
     * @param deviceNumber Device number or customer reference
     * @param limit Maximum number of transactions to retrieve details for
     * @return List of arrear transactions with full details
     */
    Map<String, Object> getArrearPaymentHistory(String deviceNumber, Integer limit);



    /**
     * Get bills for a post-payment customer
     * @param customerReference ID, reference, or meter number of the customer
     * @return List of bills with details
     */
    Map<String, Object> getBills(String customerReference);

    /**
     * Get details of a specific bill
     * @param billCode Bill code or request code
     * @return Bill details including amount, status, balance
     */
    Map<String, Object> getBillDetails(String billCode);

    /**
     * Check unpaid bills for a customer
     * @param customerReference ID, reference, or meter number
     * @return Summary of unpaid bills
     */
    Map<String, Object> checkUnpaidBills(String customerReference);

    /**
     * Get bill by ID and customer
     * @param customerId Customer ID
     * @param billNumber Bill number
     * @return Bill details
     */
    Map<String, Object> getBillByIdAndNumber(String customerId, String billNumber);




    /**
     * Pre-pay bill to validate payment details
     * @param transactionId Transaction ID
     * @param billCode Bill code or request code
     * @param amount Payment amount
     * @param phoneNumber Customer phone number
     * @param channel Vending channel (01:USSD, 02:SMS, 03:APP, 04:Vending Client, 05:Web Site)
     * @return Pre-pay response with verify code
     */
    Map<String, Object> prePayBill(String transactionId, String billCode, String amount,
                                   String phoneNumber, String channel);

    /**
     * Complete bill payment with verify code from pre-pay
     * @param transactionId Transaction ID
     * @param billCode Bill code or request code
     * @param amount Payment amount
     * @param phoneNumber Customer phone number
     * @param channel Vending channel
     * @param verifyCode Verify code from pre-pay response
     * @return Payment response with transaction code
     */
    Map<String, Object> completePayBill(String transactionId, String billCode, String amount,
                                        String phoneNumber, String channel, String verifyCode);

    /**
     * One-step bill payment (skip pre-pay verification)
     * @param transactionId Transaction ID
     * @param billCode Bill code or request code
     * @param amount Payment amount
     * @param phoneNumber Customer phone number
     * @param channel Vending channel
     * @return Payment response with transaction code
     */
    Map<String, Object> payBillOneStep(String transactionId, String billCode, String amount,
                                       String phoneNumber, String channel);

    /**
     * Get details of a specific bill payment transaction
     * @param transactionCode The transaction code or ID from a bill payment
     * @return Transaction details including customer info, amount, etc.
     */
    Map<String, Object> getBillTransactionDetails(String transactionCode);

    /**
     * Search for bill payment transactions
     * @param searchCode Bill code, request code, ID, reference, or device number (optional)
     * @return List of bill transactions
     */
    Map<String, Object> searchBillTransactions(String searchCode);

    /**
     * Get bill payment history with full details
     * @param searchCode Search code (optional)
     * @param limit Maximum number of transactions to retrieve details for
     * @return List of bill transactions with full details
     */
    Map<String, Object> getBillPaymentHistory(String searchCode, Integer limit);




}



