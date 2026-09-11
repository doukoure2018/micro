package io.digiservices.userservice.perimetre;


public interface StructureReseauRepository {

    /**
     * Réseau complet (5 délégations, ~40 agences, ~190 points de service), mis en cache
     * quelques minutes : le référentiel change rarement et /userinfo est appelé à chaque login.
     */
    StructureReseau getStructure();
}
