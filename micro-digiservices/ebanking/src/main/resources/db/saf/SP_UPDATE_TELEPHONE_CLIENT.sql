-- ============================================================================
-- SP_UPDATE_TELEPHONE_CLIENT
--
-- Procedure stockee dediee a la mise a jour du SEUL champ TEL_PRINCIPAL
-- dans la table CL.CL_CLIENTES de la base SAF.
--
-- A executer manuellement dans la base SAF (SQL Server).
-- N'altere PAS l'ancienne procedure SP_UPDATE_FICHE_SIGNALETIQUE_CLIENT.
--
-- Appelee par le microservice ebanking apres approbation du DA et clic
-- de l'agent de credit sur "Valider SAF" (workflow gere dans ecreditservice).
-- ============================================================================

CREATE OR ALTER PROCEDURE [CL].[SP_UPDATE_TELEPHONE_CLIENT]
    @p_cod_empresa     VARCHAR(5)      = '00000',
    @p_cod_cliente     VARCHAR(50),
    @p_tel_principal   VARCHAR(20),
    @p_result_code     INT             OUTPUT,
    @p_result_message  NVARCHAR(500)   OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Initialisation des sorties
        SET @p_result_code    = 0;
        SET @p_result_message = N'Succès';

        -- Validation des entrees
        IF @p_cod_cliente IS NULL OR LEN(LTRIM(RTRIM(@p_cod_cliente))) = 0
        BEGIN
            SET @p_result_code    = -1;
            SET @p_result_message = N'Le code client est obligatoire';
            RETURN;
        END

        IF @p_tel_principal IS NULL OR LEN(LTRIM(RTRIM(@p_tel_principal))) = 0
        BEGIN
            SET @p_result_code    = -2;
            SET @p_result_message = N'Le numero de telephone est obligatoire';
            RETURN;
        END

        -- Verifier l'existence du client
        IF NOT EXISTS (
            SELECT 1
              FROM [CL].[CL_CLIENTES]
             WHERE COD_EMPRESA = @p_cod_empresa
               AND COD_CLIENTE = @p_cod_cliente
        )
        BEGIN
            SET @p_result_code    = 1;
            SET @p_result_message = N'Client introuvable: ' + @p_cod_cliente;
            RETURN;
        END

        -- Mise a jour ciblee du telephone uniquement
        BEGIN TRANSACTION;

            UPDATE [CL].[CL_CLIENTES]
               SET TEL_PRINCIPAL = @p_tel_principal
             WHERE COD_EMPRESA = @p_cod_empresa
               AND COD_CLIENTE = @p_cod_cliente;

            IF @@ROWCOUNT = 0
            BEGIN
                ROLLBACK TRANSACTION;
                SET @p_result_code    = 2;
                SET @p_result_message = N'Aucune ligne mise a jour';
                RETURN;
            END

        COMMIT TRANSACTION;

        SET @p_result_code    = 0;
        SET @p_result_message = N'Telephone mis a jour avec succes pour le client ' + @p_cod_cliente;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SET @p_result_code    = ERROR_NUMBER();
        SET @p_result_message = N'Erreur SAF: ' + ERROR_MESSAGE();
    END CATCH
END
GO
