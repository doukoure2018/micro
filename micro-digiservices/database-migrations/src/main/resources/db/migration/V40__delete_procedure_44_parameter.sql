DO $$
BEGIN
    -- Check if the 44-parameter version exists
    IF EXISTS (
        SELECT 1
        FROM pg_proc
        WHERE proname = 'insert_demande_with_garanties'
        AND pronargs = 44
    ) THEN
        -- Drop the 44-parameter version
DROP FUNCTION IF EXISTS insert_demande_with_garanties(
    character varying, character varying, character varying, character varying,
    integer, integer, integer, character varying, character varying, date,
    character varying, character varying, character varying, integer, integer,
    text, character varying, integer, character varying, character varying,
    character varying, text, integer, text, character varying, character varying,
    numeric, integer, character varying, numeric, integer, integer, numeric,
    character varying, text, character varying, integer, integer, character varying,
    character varying, character varying, character varying, character varying,
    garantie_input[]
    );

RAISE NOTICE 'Dropped 44-parameter version of insert_demande_with_garanties';
ELSE
        RAISE NOTICE '44-parameter version does not exist, nothing to drop';
END IF;
END $$;
