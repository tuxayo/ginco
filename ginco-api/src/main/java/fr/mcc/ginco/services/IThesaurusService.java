/**
 * Copyright or © or Copr. Ministère Français chargé de la Culture
 * et de la Communication (2013)
 * <p/>
 * contact.gincoculture_at_gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to provide a thesaurus
 * management solution.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software. You can use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty and the software's author, the holder of the
 * economic rights, and the successive licensors have only limited liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading, using, modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean that it is complicated to manipulate, and that also
 * therefore means that it is reserved for developers and experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systemsand/or
 * data to be ensured and, more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 */
package fr.mcc.ginco.services;

import java.util.List;

import fr.mcc.ginco.beans.Language;
import fr.mcc.ginco.beans.Thesaurus;

/**
 * Service used to work with {@link Thesaurus} objects, contains basic
 * methods exposed to client part. For example, to get a single
 * Thesaurus object, use {@link #getThesaurusById(String)}
 *
 * @see fr.mcc.ginco.beans
 */
public interface IThesaurusService {

    /**
     * Get a single object by its id
     *
     * @param id to search
     * @return {@code null} if not found
     */
    Thesaurus getThesaurusById(String id);

    /**
     * Get a default thesaurus
     *
     * @return thesaurus object
     */
    Thesaurus getDefaultThesaurus();

    /**
     * Get list of all objects.
     * @return List of all objects.
     */
    List<Thesaurus> getThesaurusList();

    /**
     * Update a single ThesaurusObject
     */
    Thesaurus updateThesaurus(Thesaurus object);

    /**
     * Update the date of an existing ThesaurusObject
     * for example, after one of his concept was update
     */
    Thesaurus updateThesaurusDate(Thesaurus object);

    /**
     * Builds the list of the thesauruses languages, where the first language is
     * the default language defined in the property ginco.default.language
     * @param thesaurusId
     * @return
     */
    List<Language> getThesaurusLanguages(String thesaurusId);

    /**
     * Delete a Thesaurus object
     * @param object
     * @return
     */
    Thesaurus destroyThesaurus(Thesaurus object);

    /**
     * Publish a Thesaurus object
     * @param object
     * @return
     */
    void publishThesaurus(Thesaurus object);

    /**
     * Archive a Thesaurus object
     * @param thesaurus
     * @return
     */
    Thesaurus archiveThesaurus(Thesaurus thesaurus);


}
