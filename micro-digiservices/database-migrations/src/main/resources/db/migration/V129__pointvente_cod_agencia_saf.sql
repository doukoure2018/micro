-- V129 : perimetre du portefeuille credits SAF — correspondance point de service digi <-> agence SAF.
-- Source : liste officielle des points de service du CRG (docs/listps, codes agences SAF reels,
-- ceux de PR_CREDITOS.COD_AGENCIA). Appariement par libelle, desambiguise et verifie par l'agence
-- de rattachement. Les PS sans correspondance restent NULL (requete de controle en fin de fichier).

ALTER TABLE pointvente ADD COLUMN IF NOT EXISTS cod_agencia_saf VARCHAR(10);

COMMENT ON COLUMN pointvente.cod_agencia_saf IS
'COD_AGENCIA SAF2000 du point de service (perimetre du portefeuille credits SAF). NULL = non relie.';

UPDATE pointvente SET cod_agencia_saf = '531' WHERE cod_agencia_saf IS NULL AND libele = 'Albadaria'; -- SAF: ALBADARIA
UPDATE pointvente SET cod_agencia_saf = '559' WHERE cod_agencia_saf IS NULL AND libele = 'Arfamoussayah'; -- SAF: ARFAMOUSSAYAH
UPDATE pointvente SET cod_agencia_saf = '337' WHERE cod_agencia_saf IS NULL AND libele = 'Balandougouba'; -- SAF: BALANDOUGOUBA
UPDATE pointvente SET cod_agencia_saf = '714' WHERE cod_agencia_saf IS NULL AND libele = 'Banankoro'; -- SAF: BANANKORO
UPDATE pointvente SET cod_agencia_saf = '356' WHERE cod_agencia_saf IS NULL AND libele = 'Banfelé'; -- SAF: BANFELE
UPDATE pointvente SET cod_agencia_saf = '122' WHERE cod_agencia_saf IS NULL AND libele = 'Bangouyah'; -- SAF: BANGOUYAH
UPDATE pointvente SET cod_agencia_saf = '507' WHERE cod_agencia_saf IS NULL AND libele = 'Banian'; -- SAF: BANIAN
UPDATE pointvente SET cod_agencia_saf = '553' WHERE cod_agencia_saf IS NULL AND libele = 'Banko'; -- SAF: BANKO
UPDATE pointvente SET cod_agencia_saf = '527' WHERE cod_agencia_saf IS NULL AND libele = 'Bardou'; -- SAF: BARDOU
UPDATE pointvente SET cod_agencia_saf = '117' WHERE cod_agencia_saf IS NULL AND libele = 'Benty'; -- SAF: BENTY
UPDATE pointvente SET cod_agencia_saf = '701' WHERE cod_agencia_saf IS NULL AND libele = 'Beyla'; -- SAF: BEYLA
UPDATE pointvente SET cod_agencia_saf = '426' WHERE cod_agencia_saf IS NULL AND libele = 'Bignamou'; -- SAF: BIGNAMOU
UPDATE pointvente SET cod_agencia_saf = '602' WHERE cod_agencia_saf IS NULL AND libele = 'Bintimodia'; -- SAF: BINTIMODIA
UPDATE pointvente SET cod_agencia_saf = '554' WHERE cod_agencia_saf IS NULL AND libele = 'Bissikrima'; -- SAF: BISSIKRIMA
UPDATE pointvente SET cod_agencia_saf = '612' WHERE cod_agencia_saf IS NULL AND libele = 'Boffa'; -- SAF: BOFFA
UPDATE pointvente SET cod_agencia_saf = '604' WHERE cod_agencia_saf IS NULL AND libele = 'Boké'; -- SAF: BOKE
UPDATE pointvente SET cod_agencia_saf = '702' WHERE cod_agencia_saf IS NULL AND libele = 'Boola'; -- SAF: BOOLA
UPDATE pointvente SET cod_agencia_saf = '456' WHERE cod_agencia_saf IS NULL AND libele = 'Bowé'; -- SAF: BOWE
UPDATE pointvente SET cod_agencia_saf = '102' WHERE cod_agencia_saf IS NULL AND libele = 'Coyah'; -- SAF: COYAH
UPDATE pointvente SET cod_agencia_saf = '551' WHERE cod_agencia_saf IS NULL AND libele = 'Dabola'; -- SAF: DABOLA
UPDATE pointvente SET cod_agencia_saf = '153' WHERE cod_agencia_saf IS NULL AND libele = 'Dalaba'; -- SAF: DALABA
UPDATE pointvente SET cod_agencia_saf = '706' WHERE cod_agencia_saf IS NULL AND libele = 'Damaro'; -- SAF: DAMARO
UPDATE pointvente SET cod_agencia_saf = '530' WHERE cod_agencia_saf IS NULL AND libele = 'Dandou'; -- SAF: DANDOU
UPDATE pointvente SET cod_agencia_saf = '819' WHERE cod_agencia_saf IS NULL AND libele = 'Daro'; -- SAF: DARO
UPDATE pointvente SET cod_agencia_saf = '555' WHERE cod_agencia_saf IS NULL AND libele = 'Dialakoro'; -- SAF: DIALAKORO
UPDATE pointvente SET cod_agencia_saf = '424' WHERE cod_agencia_saf IS NULL AND libele = 'Diecke'; -- SAF: DIECKE
UPDATE pointvente SET cod_agencia_saf = '558' WHERE cod_agencia_saf IS NULL AND libele = 'Dinguiraye'; -- SAF: DINGUIRAYE
UPDATE pointvente SET cod_agencia_saf = '922' WHERE cod_agencia_saf IS NULL AND libele = 'Diountou'; -- SAF: DIOUNTOUN
UPDATE pointvente SET cod_agencia_saf = '151' WHERE cod_agencia_saf IS NULL AND libele = 'Ditinn'; -- SAF: DITINN
UPDATE pointvente SET cod_agencia_saf = '552' WHERE cod_agencia_saf IS NULL AND libele = 'Dogomet'; -- SAF: DOGOMET
UPDATE pointvente SET cod_agencia_saf = '353' WHERE cod_agencia_saf IS NULL AND libele = 'Doko'; -- SAF: DOKO
UPDATE pointvente SET cod_agencia_saf = '918' WHERE cod_agencia_saf IS NULL AND libele = 'Donghol Touma'; -- SAF: DONGHOL TOUMA
UPDATE pointvente SET cod_agencia_saf = '152' WHERE cod_agencia_saf IS NULL AND libele = 'Dounet'; -- SAF: DOUNET
UPDATE pointvente SET cod_agencia_saf = '608' WHERE cod_agencia_saf IS NULL AND libele = 'Douprou'; -- SAF: DOUPROU
UPDATE pointvente SET cod_agencia_saf = '129' WHERE cod_agencia_saf IS NULL AND libele = 'Dubreka'; -- SAF: DUBREKA
UPDATE pointvente SET cod_agencia_saf = '953' WHERE cod_agencia_saf IS NULL AND libele = 'Enta'; -- SAF: ENTA
UPDATE pointvente SET cod_agencia_saf = '513' WHERE cod_agencia_saf IS NULL AND libele = 'Faranah'; -- SAF: FARANAH
UPDATE pointvente SET cod_agencia_saf = '709' WHERE cod_agencia_saf IS NULL AND libele = 'Fouala'; -- SAF: FOUALA
UPDATE pointvente SET cod_agencia_saf = '358' WHERE cod_agencia_saf IS NULL AND libele = 'Franwalia	'; -- SAF: FRANWALIA
UPDATE pointvente SET cod_agencia_saf = '960' WHERE cod_agencia_saf IS NULL AND libele = 'Fria'; -- SAF: FRIA
UPDATE pointvente SET cod_agencia_saf = '413' WHERE cod_agencia_saf IS NULL AND libele = 'Gamaberema'; -- SAF: GAMABEREMA
UPDATE pointvente SET cod_agencia_saf = '234' WHERE cod_agencia_saf IS NULL AND libele = 'Gaoual'; -- SAF: GAOUAL
UPDATE pointvente SET cod_agencia_saf = '703' WHERE cod_agencia_saf IS NULL AND libele = 'Gbackedou'; -- SAF: GBACKEDOU
UPDATE pointvente SET cod_agencia_saf = '708' WHERE cod_agencia_saf IS NULL AND libele = 'Gbessoba'; -- SAF: GBESSOBA
UPDATE pointvente SET cod_agencia_saf = '162' WHERE cod_agencia_saf IS NULL AND libele = 'Gongoré'; -- SAF: GONGORE
UPDATE pointvente SET cod_agencia_saf = '401' WHERE cod_agencia_saf IS NULL AND libele = 'Gouecke'; -- SAF: GOUECKE
UPDATE pointvente SET cod_agencia_saf = '803' WHERE cod_agencia_saf IS NULL AND libele = 'Gueckedou'; -- SAF: GUECKEDOU
UPDATE pointvente SET cod_agencia_saf = '814' WHERE cod_agencia_saf IS NULL AND libele = 'Guendembou'; -- SAF: GUENDEMBOU
UPDATE pointvente SET cod_agencia_saf = '536' WHERE cod_agencia_saf IS NULL AND libele = 'Hermakono'; -- SAF: HERMAKONO
UPDATE pointvente SET cod_agencia_saf = '128' WHERE cod_agencia_saf IS NULL AND libele = 'KM36'; -- SAF: KM36
UPDATE pointvente SET cod_agencia_saf = '345' WHERE cod_agencia_saf IS NULL AND libele = 'Kaboukaria'; -- SAF: KABOUKARIA
UPDATE pointvente SET cod_agencia_saf = '213' WHERE cod_agencia_saf IS NULL AND libele = 'Kakoni'; -- SAF: KAKONI
UPDATE pointvente SET cod_agencia_saf = '556' WHERE cod_agencia_saf IS NULL AND libele = 'Kalinko'; -- SAF: KALINKO
UPDATE pointvente SET cod_agencia_saf = '951' WHERE cod_agencia_saf IS NULL AND libele = 'Kaloum'; -- SAF: KALOUM
UPDATE pointvente SET cod_agencia_saf = '601' WHERE cod_agencia_saf IS NULL AND libele = 'Kamsar'; -- SAF: KAMSAR
UPDATE pointvente SET cod_agencia_saf = '923' WHERE cod_agencia_saf IS NULL AND libele = 'Kankalabé'; -- SAF: KANKALABE
UPDATE pointvente SET cod_agencia_saf = '322' WHERE cod_agencia_saf IS NULL AND libele = 'Kankan'; -- SAF: KANKAN
UPDATE pointvente SET cod_agencia_saf = '340' WHERE cod_agencia_saf IS NULL AND libele = 'Kantoumanina'; -- SAF: KANTOUMANINA
UPDATE pointvente SET cod_agencia_saf = '532' WHERE cod_agencia_saf IS NULL AND libele = 'Kassadou'; -- SAF: KASSADOU
UPDATE pointvente SET cod_agencia_saf = '705' WHERE cod_agencia_saf IS NULL AND libele = 'Kerouané'; -- SAF: KEROUANE
UPDATE pointvente SET cod_agencia_saf = '121' WHERE cod_agencia_saf IS NULL AND libele = 'Kindia'; -- SAF: KINDIA
UPDATE pointvente SET cod_agencia_saf = '323' WHERE cod_agencia_saf IS NULL AND libele = 'Kinieran'; -- SAF: KINIERAN
UPDATE pointvente SET cod_agencia_saf = '363' WHERE cod_agencia_saf IS NULL AND libele = 'Kiniero'; -- SAF: KINIERO
UPDATE pointvente SET cod_agencia_saf = '357' WHERE cod_agencia_saf IS NULL AND libele = 'Kintinia'; -- SAF: KINTINIA
UPDATE pointvente SET cod_agencia_saf = '523' WHERE cod_agencia_saf IS NULL AND libele = 'Kissidougou'; -- SAF: KISSIDOUGOU
UPDATE pointvente SET cod_agencia_saf = '455' WHERE cod_agencia_saf IS NULL AND libele = 'Kobela'; -- SAF: KOBELA
UPDATE pointvente SET cod_agencia_saf = '533' WHERE cod_agencia_saf IS NULL AND libele = 'Kobikoro'; -- SAF: KOBIKORO
UPDATE pointvente SET cod_agencia_saf = '924' WHERE cod_agencia_saf IS NULL AND libele = 'Koin'; -- SAF: KOIN
UPDATE pointvente SET cod_agencia_saf = '417' WHERE cod_agencia_saf IS NULL AND libele = 'Kokota'; -- SAF: KOKOTA
UPDATE pointvente SET cod_agencia_saf = '603' WHERE cod_agencia_saf IS NULL AND libele = 'Kolaboui'; -- SAF: KOLABOUI
UPDATE pointvente SET cod_agencia_saf = '613' WHERE cod_agencia_saf IS NULL AND libele = 'Kolia'; -- SAF: KOLIA_LAMBANDJI
UPDATE pointvente SET cod_agencia_saf = '715' WHERE cod_agencia_saf IS NULL AND libele = 'Komodou'; -- SAF: KOMODOU
UPDATE pointvente SET cod_agencia_saf = '346' WHERE cod_agencia_saf IS NULL AND libele = 'Komola'; -- SAF: KOMOLA
UPDATE pointvente SET cod_agencia_saf = '915' WHERE cod_agencia_saf IS NULL AND libele = 'Konah'; -- SAF: KONAH
UPDATE pointvente SET cod_agencia_saf = '528' WHERE cod_agencia_saf IS NULL AND libele = 'Kondiadou'; -- SAF: KONDIADOU
UPDATE pointvente SET cod_agencia_saf = '343' WHERE cod_agencia_saf IS NULL AND libele = 'Kondianakoro'; -- SAF: KONDIANAKORO
UPDATE pointvente SET cod_agencia_saf = '816' WHERE cod_agencia_saf IS NULL AND libele = 'Kouankan'; -- SAF: KOUANKAN
UPDATE pointvente SET cod_agencia_saf = '912' WHERE cod_agencia_saf IS NULL AND libele = 'Koubia'; -- SAF: KOUBIA
UPDATE pointvente SET cod_agencia_saf = '614' WHERE cod_agencia_saf IS NULL AND libele = 'Koukoudé'; -- SAF: KOUKOUDE
UPDATE pointvente SET cod_agencia_saf = '408' WHERE cod_agencia_saf IS NULL AND libele = 'Koulé'; -- SAF: KOULE
UPDATE pointvente SET cod_agencia_saf = '355' WHERE cod_agencia_saf IS NULL AND libele = 'Koumana'; -- SAF: KOUMANA
UPDATE pointvente SET cod_agencia_saf = '235' WHERE cod_agencia_saf IS NULL AND libele = 'Koumbia'; -- SAF: KOUMBIA
UPDATE pointvente SET cod_agencia_saf = '232' WHERE cod_agencia_saf IS NULL AND libele = 'Koundara'; -- SAF: KOUNDARA
UPDATE pointvente SET cod_agencia_saf = '811' WHERE cod_agencia_saf IS NULL AND libele = 'Koundou'; -- SAF: KOUNDOU
UPDATE pointvente SET cod_agencia_saf = '907' WHERE cod_agencia_saf IS NULL AND libele = 'Kouramangui'; -- SAF: KOURAMANGUI
UPDATE pointvente SET cod_agencia_saf = '362' WHERE cod_agencia_saf IS NULL AND libele = 'Kouremale'; -- SAF: KOUREMALE
UPDATE pointvente SET cod_agencia_saf = '321' WHERE cod_agencia_saf IS NULL AND libele = 'Kouroussa'; -- SAF: KOUROUSSA
UPDATE pointvente SET cod_agencia_saf = '808' WHERE cod_agencia_saf IS NULL AND libele = 'Koyamah'; -- SAF: KOYAMAH
UPDATE pointvente SET cod_agencia_saf = '910' WHERE cod_agencia_saf IS NULL AND libele = 'Labé'; -- SAF: LABE
UPDATE pointvente SET cod_agencia_saf = '415' WHERE cod_agencia_saf IS NULL AND libele = 'Lainé'; -- SAF: LAINE
UPDATE pointvente SET cod_agencia_saf = '911' WHERE cod_agencia_saf IS NULL AND libele = 'Lelouma'; -- SAF: LELOUMA
UPDATE pointvente SET cod_agencia_saf = '160' WHERE cod_agencia_saf IS NULL AND libele = 'Linsan'; -- SAF: LINSAN
UPDATE pointvente SET cod_agencia_saf = '344' WHERE cod_agencia_saf IS NULL AND libele = 'Loila'; -- SAF: LOILA
UPDATE pointvente SET cod_agencia_saf = '402' WHERE cod_agencia_saf IS NULL AND libele = 'Lola'; -- SAF: LOLA
UPDATE pointvente SET cod_agencia_saf = '801' WHERE cod_agencia_saf IS NULL AND libele = 'Macenta'; -- SAF: MACENTA
UPDATE pointvente SET cod_agencia_saf = '955' WHERE cod_agencia_saf IS NULL AND libele = 'Madina'; -- SAF: MADINA
UPDATE pointvente SET cod_agencia_saf = '126' WHERE cod_agencia_saf IS NULL AND libele = 'Madina Oula'; -- SAF: MADINA_OULA
UPDATE pointvente SET cod_agencia_saf = '112' WHERE cod_agencia_saf IS NULL AND libele = 'Maferinyah'; -- SAF: MAFERINYAH
UPDATE pointvente SET cod_agencia_saf = '354' WHERE cod_agencia_saf IS NULL AND libele = 'Maleah'; -- SAF: MALEAH
UPDATE pointvente SET cod_agencia_saf = '913' WHERE cod_agencia_saf IS NULL AND libele = 'Mali'; -- SAF: MALI
UPDATE pointvente SET cod_agencia_saf = '120' WHERE cod_agencia_saf IS NULL AND libele = 'Mambia'; -- SAF: MAMBIA
UPDATE pointvente SET cod_agencia_saf = '155' WHERE cod_agencia_saf IS NULL AND libele = 'Mamou'; -- SAF: MAMOU
UPDATE pointvente SET cod_agencia_saf = '324' WHERE cod_agencia_saf IS NULL AND libele = 'Mandiana'; -- SAF: MANDIANA
UPDATE pointvente SET cod_agencia_saf = '607' WHERE cod_agencia_saf IS NULL AND libele = 'Mankountan'; -- SAF: MANKOUNTAN
UPDATE pointvente SET cod_agencia_saf = '516' WHERE cod_agencia_saf IS NULL AND libele = 'Marela'; -- SAF: MARELA
UPDATE pointvente SET cod_agencia_saf = '952' WHERE cod_agencia_saf IS NULL AND libele = 'Matoto'; -- SAF: MATOTO
UPDATE pointvente SET cod_agencia_saf = '560' WHERE cod_agencia_saf IS NULL AND libele = 'Mbonet'; -- SAF: MBONET
UPDATE pointvente SET cod_agencia_saf = '333' WHERE cod_agencia_saf IS NULL AND libele = 'Missamana'; -- SAF: MISSAMANA
UPDATE pointvente SET cod_agencia_saf = '611' WHERE cod_agencia_saf IS NULL AND libele = 'Missira'; -- SAF: MISSIRA
UPDATE pointvente SET cod_agencia_saf = '713' WHERE cod_agencia_saf IS NULL AND libele = 'Moribadou'; -- SAF: MORIBADOU
UPDATE pointvente SET cod_agencia_saf = '331' WHERE cod_agencia_saf IS NULL AND libele = 'Moribayah'; -- SAF: MORIBAYA
UPDATE pointvente SET cod_agencia_saf = '341' WHERE cod_agencia_saf IS NULL AND libele = 'Morodou'; -- SAF: MORODOU
UPDATE pointvente SET cod_agencia_saf = '115' WHERE cod_agencia_saf IS NULL AND libele = 'Moussayah'; -- SAF: MOUSSAYAH
UPDATE pointvente SET cod_agencia_saf = '425' WHERE cod_agencia_saf IS NULL AND libele = 'N''Zoo'; -- SAF: N'ZOO
UPDATE pointvente SET cod_agencia_saf = '336' WHERE cod_agencia_saf IS NULL AND libele = 'Nafagui'; -- SAF: BATE NAFAGUI
UPDATE pointvente SET cod_agencia_saf = '360' WHERE cod_agencia_saf IS NULL AND libele = 'Niandankoro'; -- SAF: NIANDAN
UPDATE pointvente SET cod_agencia_saf = '339' WHERE cod_agencia_saf IS NULL AND libele = 'Niantanina	'; -- SAF: NIANTANINA
UPDATE pointvente SET cod_agencia_saf = '812' WHERE cod_agencia_saf IS NULL AND libele = 'Nongoa'; -- SAF: NONGOA
UPDATE pointvente SET cod_agencia_saf = '338' WHERE cod_agencia_saf IS NULL AND libele = 'Ourola'; -- SAF: OUROLA
UPDATE pointvente SET cod_agencia_saf = '161' WHERE cod_agencia_saf IS NULL AND libele = 'Ouré Kaba'; -- SAF: OURE KABA
UPDATE pointvente SET cod_agencia_saf = '412' WHERE cod_agencia_saf IS NULL AND libele = 'Palé'; -- SAF: PALE
UPDATE pointvente SET cod_agencia_saf = '818' WHERE cod_agencia_saf IS NULL AND libele = 'Panziazou'; -- SAF: PANZIAZOU
UPDATE pointvente SET cod_agencia_saf = '524' WHERE cod_agencia_saf IS NULL AND libele = 'Passayah'; -- SAF: PASSAYA
UPDATE pointvente SET cod_agencia_saf = '423' WHERE cod_agencia_saf IS NULL AND libele = 'Pela'; -- SAF: PELA
UPDATE pointvente SET cod_agencia_saf = '916' WHERE cod_agencia_saf IS NULL AND libele = 'Pita'; -- SAF: PITA
UPDATE pointvente SET cod_agencia_saf = '909' WHERE cod_agencia_saf IS NULL AND libele = 'Popodara'; -- SAF: POPODARA
UPDATE pointvente SET cod_agencia_saf = '154' WHERE cod_agencia_saf IS NULL AND libele = 'Poredaka'; -- SAF: POREDAKA
UPDATE pointvente SET cod_agencia_saf = '710' WHERE cod_agencia_saf IS NULL AND libele = 'Samana'; -- SAF: SAMANA
UPDATE pointvente SET cod_agencia_saf = '421' WHERE cod_agencia_saf IS NULL AND libele = 'Samoe'; -- SAF: SAMOE
UPDATE pointvente SET cod_agencia_saf = '510' WHERE cod_agencia_saf IS NULL AND libele = 'Sandenia'; -- SAF: SANDENIA
UPDATE pointvente SET cod_agencia_saf = '519' WHERE cod_agencia_saf IS NULL AND libele = 'Sangardo'; -- SAF: SANGARDO
UPDATE pointvente SET cod_agencia_saf = '605' WHERE cod_agencia_saf IS NULL AND libele = 'Sangaredi'; -- SAF: SANGAREDI
UPDATE pointvente SET cod_agencia_saf = '163' WHERE cod_agencia_saf IS NULL AND libele = 'Saramoussayah'; -- SAF: SARAMOUSSAYA
UPDATE pointvente SET cod_agencia_saf = '347' WHERE cod_agencia_saf IS NULL AND libele = 'Saraya'; -- SAF: SARAYA
UPDATE pointvente SET cod_agencia_saf = '233' WHERE cod_agencia_saf IS NULL AND libele = 'Sareboido'; -- SAF: SAREBOIDO
UPDATE pointvente SET cod_agencia_saf = '802' WHERE cod_agencia_saf IS NULL AND libele = 'Seredou'; -- SAF: SEREDOU
UPDATE pointvente SET cod_agencia_saf = '351' WHERE cod_agencia_saf IS NULL AND libele = 'Siguiri'; -- SAF: SIGUIRI
UPDATE pointvente SET cod_agencia_saf = '361' WHERE cod_agencia_saf IS NULL AND libele = 'Siguirini'; -- SAF: SIGUIRINI
UPDATE pointvente SET cod_agencia_saf = '118' WHERE cod_agencia_saf IS NULL AND libele = 'Sikhourou'; -- SAF: SIKHOUROU
UPDATE pointvente SET cod_agencia_saf = '704' WHERE cod_agencia_saf IS NULL AND libele = 'Sinko'; -- SAF: SINKO
UPDATE pointvente SET cod_agencia_saf = '208' WHERE cod_agencia_saf IS NULL AND libele = 'Sinta'; -- SAF: SINTA
UPDATE pointvente SET cod_agencia_saf = '956' WHERE cod_agencia_saf IS NULL AND libele = 'Sonfonia'; -- SAF: SONFONIA
UPDATE pointvente SET cod_agencia_saf = '537' WHERE cod_agencia_saf IS NULL AND libele = 'Songoyah'; -- SAF: SONGOYAH
UPDATE pointvente SET cod_agencia_saf = '418' WHERE cod_agencia_saf IS NULL AND libele = 'Soulouta'; -- SAF: SOULOUTA
UPDATE pointvente SET cod_agencia_saf = '954' WHERE cod_agencia_saf IS NULL AND libele = 'Taouyah'; -- SAF: TAOUYAH
UPDATE pointvente SET cod_agencia_saf = '231' WHERE cod_agencia_saf IS NULL AND libele = 'Tarihoye'; -- SAF: TARIHOYE
UPDATE pointvente SET cod_agencia_saf = '201' WHERE cod_agencia_saf IS NULL AND libele = 'Telimelé'; -- SAF: TELIMELE
UPDATE pointvente SET cod_agencia_saf = '810' WHERE cod_agencia_saf IS NULL AND libele = 'Temessadou'; -- SAF: TEMESSADOU
UPDATE pointvente SET cod_agencia_saf = '236' WHERE cod_agencia_saf IS NULL AND libele = 'Termessé'; -- SAF: TERMESSE
UPDATE pointvente SET cod_agencia_saf = '919' WHERE cod_agencia_saf IS NULL AND libele = 'Timbi Madina'; -- SAF: TIMBI MADINA
UPDATE pointvente SET cod_agencia_saf = '917' WHERE cod_agencia_saf IS NULL AND libele = 'Timbi Touni'; -- SAF: TIMBI TOUNI
UPDATE pointvente SET cod_agencia_saf = '334' WHERE cod_agencia_saf IS NULL AND libele = 'Tintioulen'; -- SAF: TINTIOULEN
UPDATE pointvente SET cod_agencia_saf = '514' WHERE cod_agencia_saf IS NULL AND libele = 'Tiro'; -- SAF: TIRO
UPDATE pointvente SET cod_agencia_saf = '535' WHERE cod_agencia_saf IS NULL AND libele = 'Tokounou'; -- SAF: TOKOUNOU
UPDATE pointvente SET cod_agencia_saf = '237' WHERE cod_agencia_saf IS NULL AND libele = 'Touba'; -- SAF: TOUBA
UPDATE pointvente SET cod_agencia_saf = '606' WHERE cod_agencia_saf IS NULL AND libele = 'Tougnifily'; -- SAF: TOUGNIFILY
UPDATE pointvente SET cod_agencia_saf = '914' WHERE cod_agencia_saf IS NULL AND libele = 'Tougué'; -- SAF: TOUGUE
UPDATE pointvente SET cod_agencia_saf = '416' WHERE cod_agencia_saf IS NULL AND libele = 'Tounkarata'; -- SAF: TOUNKARATA
UPDATE pointvente SET cod_agencia_saf = '529' WHERE cod_agencia_saf IS NULL AND libele = 'Yombiro'; -- SAF: YOMBIRO
UPDATE pointvente SET cod_agencia_saf = '422' WHERE cod_agencia_saf IS NULL AND libele = 'Yomou'; -- SAF: YOMOU
UPDATE pointvente SET cod_agencia_saf = '959' WHERE cod_agencia_saf IS NULL AND libele = 'koba'; -- SAF: KOBA
UPDATE pointvente SET cod_agencia_saf = '958' WHERE cod_agencia_saf IS NULL AND libele = 'tanene'; -- SAF: TANENE

-- Variantes d'orthographe verifiees par concordance d'agence
UPDATE pointvente SET cod_agencia_saf = '813' WHERE cod_agencia_saf IS NULL AND libele = 'Boffosou'; -- SAF: BOFOSSOU
UPDATE pointvente SET cod_agencia_saf = '330' WHERE cod_agencia_saf IS NULL AND libele = 'Dalakoro'; -- SAF: DIALAKORO
UPDATE pointvente SET cod_agencia_saf = '127' WHERE cod_agencia_saf IS NULL AND libele = 'Farmoriaya'; -- SAF: FARMORIYA
UPDATE pointvente SET cod_agencia_saf = '809' WHERE cod_agencia_saf IS NULL AND libele = 'Fassankony'; -- SAF: FASSANKONI
UPDATE pointvente SET cod_agencia_saf = '103' WHERE cod_agencia_saf IS NULL AND libele = 'Foracariah'; -- SAF: FORECARIAH
UPDATE pointvente SET cod_agencia_saf = '534' WHERE cod_agencia_saf IS NULL AND libele = 'Fremessadou'; -- SAF: FERMESSADOU
UPDATE pointvente SET cod_agencia_saf = '124' WHERE cod_agencia_saf IS NULL AND libele = 'Friguiabé'; -- SAF: FRIGUIAGBE
UPDATE pointvente SET cod_agencia_saf = '815' WHERE cod_agencia_saf IS NULL AND libele = 'Gbeunikala'; -- SAF: BINIKALA
UPDATE pointvente SET cod_agencia_saf = '342' WHERE cod_agencia_saf IS NULL AND libele = 'Koundian'; -- SAF: KOUNDJAN
UPDATE pointvente SET cod_agencia_saf = '220' WHERE cod_agencia_saf IS NULL AND libele = 'Ley Miro'; -- SAF: LEYMIRO
UPDATE pointvente SET cod_agencia_saf = '419' WHERE cod_agencia_saf IS NULL AND libele = 'N''Zerekoré 1'; -- SAF: NZEREKORE1
UPDATE pointvente SET cod_agencia_saf = '420' WHERE cod_agencia_saf IS NULL AND libele = 'N''Zerekoré 2'; -- SAF: NZEREKORE II
UPDATE pointvente SET cod_agencia_saf = '352' WHERE cod_agencia_saf IS NULL AND libele = 'Norasoba'; -- SAF: NORASSOBA
UPDATE pointvente SET cod_agencia_saf = '359' WHERE cod_agencia_saf IS NULL AND libele = 'Noukounkan'; -- SAF: NOUNKOUNKAN
UPDATE pointvente SET cod_agencia_saf = '817' WHERE cod_agencia_saf IS NULL AND libele = 'Ouendekenema'; -- SAF: OUENDE KENEMA
UPDATE pointvente SET cod_agencia_saf = '335' WHERE cod_agencia_saf IS NULL AND libele = 'Sabadoubranama'; -- SAF: SABADOU BRANAMA
UPDATE pointvente SET cod_agencia_saf = '238' WHERE cod_agencia_saf IS NULL AND libele = 'Sangareah'; -- SAF: SANGAREYAH
UPDATE pointvente SET cod_agencia_saf = '921' WHERE cod_agencia_saf IS NULL AND libele = 'Sanou'; -- SAF: SANNOU
UPDATE pointvente SET cod_agencia_saf = '908' WHERE cod_agencia_saf IS NULL AND libele = 'Thianguel Bory'; -- SAF: THIAGUEL BORI
UPDATE pointvente SET cod_agencia_saf = '609' WHERE cod_agencia_saf IS NULL AND libele = 'Wendoubour'; -- SAF: WENDOU MBOUR
UPDATE pointvente SET cod_agencia_saf = '920' WHERE cod_agencia_saf IS NULL AND libele = 'Yembering'; -- SAF: YIMBERING
UPDATE pointvente SET cod_agencia_saf = '526' WHERE cod_agencia_saf IS NULL AND libele = 'Yende Milimou'; -- SAF: YENDE MILLIMOU

-- Controle des PS restes sans correspondance :
-- SELECT id, libele FROM pointvente WHERE cod_agencia_saf IS NULL ORDER BY libele;
