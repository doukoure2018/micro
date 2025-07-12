ALTER TABLE public.credit
    ADD COLUMN "montantCredit" NUMERIC(15,2) DEFAULT 0
        CHECK ("montantCredit" >= 0);