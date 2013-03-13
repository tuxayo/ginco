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
package fr.mcc.ginco.rest.services;

import java.io.File;

import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.MultipartBody;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import fr.mcc.ginco.beans.Thesaurus;
import fr.mcc.ginco.exceptions.BusinessException;
import fr.mcc.ginco.extjs.view.ExtJsonFormLoadData;
import fr.mcc.ginco.extjs.view.pojo.ThesaurusView;
import fr.mcc.ginco.extjs.view.utils.ThesaurusViewConverter;
import fr.mcc.ginco.imports.ISKOSImportService;
import fr.mcc.ginco.log.Log;

/**
 * Base REST service intended to be used for SKOS Import
 */
@Service
@Path("/importservice")
@Produces({ MediaType.APPLICATION_JSON })
public class ImportRestService {
	@Context
	private javax.servlet.ServletContext servletContext;
	
	@Inject
	@Named("skosImportService")
	private ISKOSImportService skosImportService;
	
	@Inject
	@Named("thesaurusViewConverter")
	private ThesaurusViewConverter thesaurusViewConverter;
	
	@Log
	private Logger logger;
	
	@POST
	@Path("/import")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public ExtJsonFormLoadData<ThesaurusView> uploadFile(MultipartBody body, @Context HttpServletRequest request) throws BusinessException {
		Attachment file = body.getAttachment("import-file-path");
		String content  = file.getObject(String.class);
		String fileName = file.getDataHandler().getName();
		
		File tempdir = (File)servletContext.getAttribute("javax.servlet.context.tempdir");  
		
		Thesaurus importedThesaurus = skosImportService.importSKOSFile(content, fileName, tempdir);
	
		logger.debug("File received");
		logger.debug(fileName);
		logger.debug("EOF");
		/*
		for (Attachment attr : attachments) {
			DataHandler handler = attr.getDataHandler();
			try {
				InputStream stream = handler.getInputStream();	

				logger.debug("Imported file");
				int i;
				StringBuilder b = new StringBuilder();
                while( (i=stream.read()) != -1 ) {
                    b.append((char)i);
                }
				
				logger.debug(b.toString());
				
				stream.close();
			
			} catch (Exception e) {
				logger.error("Error reading file for import", e);
			}
		}*/
		return new ExtJsonFormLoadData<ThesaurusView>(thesaurusViewConverter.convert(importedThesaurus));

	}	
}