package grafikon.web.rest;

import grafikon.domain.Grfikon;
import grafikon.repository.GrfikonRepository;
import grafikon.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link grafikon.domain.Grfikon}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GrfikonResource {

    private final Logger log = LoggerFactory.getLogger(GrfikonResource.class);

    private static final String ENTITY_NAME = "grfikon";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GrfikonRepository grfikonRepository;

    public GrfikonResource(GrfikonRepository grfikonRepository) {
        this.grfikonRepository = grfikonRepository;
    }

    /**
     * {@code POST  /grfikons} : Create a new grfikon.
     *
     * @param grfikon the grfikon to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grfikon, or with status {@code 400 (Bad Request)} if the grfikon has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/grfikons")
    public ResponseEntity<Grfikon> createGrfikon(@RequestBody Grfikon grfikon) throws URISyntaxException {
        log.debug("REST request to save Grfikon : {}", grfikon);
        if (grfikon.getId() != null) {
            throw new BadRequestAlertException("A new grfikon cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Grfikon result = grfikonRepository.save(grfikon);
        return ResponseEntity
            .created(new URI("/api/grfikons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /grfikons/:id} : Updates an existing grfikon.
     *
     * @param id the id of the grfikon to save.
     * @param grfikon the grfikon to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grfikon,
     * or with status {@code 400 (Bad Request)} if the grfikon is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grfikon couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/grfikons/{id}")
    public ResponseEntity<Grfikon> updateGrfikon(@PathVariable(value = "id", required = false) final Long id, @RequestBody Grfikon grfikon)
        throws URISyntaxException {
        log.debug("REST request to update Grfikon : {}, {}", id, grfikon);
        if (grfikon.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grfikon.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grfikonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Grfikon result = grfikonRepository.save(grfikon);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, grfikon.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /grfikons/:id} : Partial updates given fields of an existing grfikon, field will ignore if it is null
     *
     * @param id the id of the grfikon to save.
     * @param grfikon the grfikon to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grfikon,
     * or with status {@code 400 (Bad Request)} if the grfikon is not valid,
     * or with status {@code 404 (Not Found)} if the grfikon is not found,
     * or with status {@code 500 (Internal Server Error)} if the grfikon couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/grfikons/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Grfikon> partialUpdateGrfikon(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Grfikon grfikon
    ) throws URISyntaxException {
        log.debug("REST request to partial update Grfikon partially : {}, {}", id, grfikon);
        if (grfikon.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grfikon.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grfikonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Grfikon> result = grfikonRepository
            .findById(grfikon.getId())
            .map(existingGrfikon -> {
                if (grfikon.getRegion() != null) {
                    existingGrfikon.setRegion(grfikon.getRegion());
                }
                if (grfikon.getPromet() != null) {
                    existingGrfikon.setPromet(grfikon.getPromet());
                }

                return existingGrfikon;
            })
            .map(grfikonRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, grfikon.getId().toString())
        );
    }

    /**
     * {@code GET  /grfikons} : get all the grfikons.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grfikons in body.
     */
    @GetMapping("/grfikons")
    public List<Grfikon> getAllGrfikons() {
        log.debug("REST request to get all Grfikons");
        return grfikonRepository.findAll();
    }

    /**
     * {@code GET  /grfikons/:id} : get the "id" grfikon.
     *
     * @param id the id of the grfikon to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the grfikon, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/grfikons/{id}")
    public ResponseEntity<Grfikon> getGrfikon(@PathVariable Long id) {
        log.debug("REST request to get Grfikon : {}", id);
        Optional<Grfikon> grfikon = grfikonRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(grfikon);
    }

    /**
     * {@code DELETE  /grfikons/:id} : delete the "id" grfikon.
     *
     * @param id the id of the grfikon to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/grfikons/{id}")
    public ResponseEntity<Void> deleteGrfikon(@PathVariable Long id) {
        log.debug("REST request to delete Grfikon : {}", id);
        grfikonRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
