package grafikon.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import grafikon.IntegrationTest;
import grafikon.domain.Grfikon;
import grafikon.repository.GrfikonRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GrfikonResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GrfikonResourceIT {

    private static final String DEFAULT_REGION = "AAAAAAAAAA";
    private static final String UPDATED_REGION = "BBBBBBBBBB";

    private static final Integer DEFAULT_PROMET = 1;
    private static final Integer UPDATED_PROMET = 2;

    private static final String ENTITY_API_URL = "/api/grfikons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GrfikonRepository grfikonRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGrfikonMockMvc;

    private Grfikon grfikon;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grfikon createEntity(EntityManager em) {
        Grfikon grfikon = new Grfikon().region(DEFAULT_REGION).promet(DEFAULT_PROMET);
        return grfikon;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grfikon createUpdatedEntity(EntityManager em) {
        Grfikon grfikon = new Grfikon().region(UPDATED_REGION).promet(UPDATED_PROMET);
        return grfikon;
    }

    @BeforeEach
    public void initTest() {
        grfikon = createEntity(em);
    }

    @Test
    @Transactional
    void createGrfikon() throws Exception {
        int databaseSizeBeforeCreate = grfikonRepository.findAll().size();
        // Create the Grfikon
        restGrfikonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grfikon)))
            .andExpect(status().isCreated());

        // Validate the Grfikon in the database
        List<Grfikon> grfikonList = grfikonRepository.findAll();
        assertThat(grfikonList).hasSize(databaseSizeBeforeCreate + 1);
        Grfikon testGrfikon = grfikonList.get(grfikonList.size() - 1);
        assertThat(testGrfikon.getRegion()).isEqualTo(DEFAULT_REGION);
        assertThat(testGrfikon.getPromet()).isEqualTo(DEFAULT_PROMET);
    }

    @Test
    @Transactional
    void createGrfikonWithExistingId() throws Exception {
        // Create the Grfikon with an existing ID
        grfikon.setId(1L);

        int databaseSizeBeforeCreate = grfikonRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGrfikonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grfikon)))
            .andExpect(status().isBadRequest());

        // Validate the Grfikon in the database
        List<Grfikon> grfikonList = grfikonRepository.findAll();
        assertThat(grfikonList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGrfikons() throws Exception {
        // Initialize the database
        grfikonRepository.saveAndFlush(grfikon);

        // Get all the grfikonList
        restGrfikonMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(grfikon.getId().intValue())))
            .andExpect(jsonPath("$.[*].region").value(hasItem(DEFAULT_REGION)))
            .andExpect(jsonPath("$.[*].promet").value(hasItem(DEFAULT_PROMET)));
    }

    @Test
    @Transactional
    void getGrfikon() throws Exception {
        // Initialize the database
        grfikonRepository.saveAndFlush(grfikon);

        // Get the grfikon
        restGrfikonMockMvc
            .perform(get(ENTITY_API_URL_ID, grfikon.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(grfikon.getId().intValue()))
            .andExpect(jsonPath("$.region").value(DEFAULT_REGION))
            .andExpect(jsonPath("$.promet").value(DEFAULT_PROMET));
    }

    @Test
    @Transactional
    void getNonExistingGrfikon() throws Exception {
        // Get the grfikon
        restGrfikonMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGrfikon() throws Exception {
        // Initialize the database
        grfikonRepository.saveAndFlush(grfikon);

        int databaseSizeBeforeUpdate = grfikonRepository.findAll().size();

        // Update the grfikon
        Grfikon updatedGrfikon = grfikonRepository.findById(grfikon.getId()).get();
        // Disconnect from session so that the updates on updatedGrfikon are not directly saved in db
        em.detach(updatedGrfikon);
        updatedGrfikon.region(UPDATED_REGION).promet(UPDATED_PROMET);

        restGrfikonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGrfikon.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGrfikon))
            )
            .andExpect(status().isOk());

        // Validate the Grfikon in the database
        List<Grfikon> grfikonList = grfikonRepository.findAll();
        assertThat(grfikonList).hasSize(databaseSizeBeforeUpdate);
        Grfikon testGrfikon = grfikonList.get(grfikonList.size() - 1);
        assertThat(testGrfikon.getRegion()).isEqualTo(UPDATED_REGION);
        assertThat(testGrfikon.getPromet()).isEqualTo(UPDATED_PROMET);
    }

    @Test
    @Transactional
    void putNonExistingGrfikon() throws Exception {
        int databaseSizeBeforeUpdate = grfikonRepository.findAll().size();
        grfikon.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrfikonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, grfikon.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grfikon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grfikon in the database
        List<Grfikon> grfikonList = grfikonRepository.findAll();
        assertThat(grfikonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGrfikon() throws Exception {
        int databaseSizeBeforeUpdate = grfikonRepository.findAll().size();
        grfikon.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrfikonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grfikon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grfikon in the database
        List<Grfikon> grfikonList = grfikonRepository.findAll();
        assertThat(grfikonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGrfikon() throws Exception {
        int databaseSizeBeforeUpdate = grfikonRepository.findAll().size();
        grfikon.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrfikonMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grfikon)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grfikon in the database
        List<Grfikon> grfikonList = grfikonRepository.findAll();
        assertThat(grfikonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGrfikonWithPatch() throws Exception {
        // Initialize the database
        grfikonRepository.saveAndFlush(grfikon);

        int databaseSizeBeforeUpdate = grfikonRepository.findAll().size();

        // Update the grfikon using partial update
        Grfikon partialUpdatedGrfikon = new Grfikon();
        partialUpdatedGrfikon.setId(grfikon.getId());

        partialUpdatedGrfikon.region(UPDATED_REGION).promet(UPDATED_PROMET);

        restGrfikonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrfikon.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrfikon))
            )
            .andExpect(status().isOk());

        // Validate the Grfikon in the database
        List<Grfikon> grfikonList = grfikonRepository.findAll();
        assertThat(grfikonList).hasSize(databaseSizeBeforeUpdate);
        Grfikon testGrfikon = grfikonList.get(grfikonList.size() - 1);
        assertThat(testGrfikon.getRegion()).isEqualTo(UPDATED_REGION);
        assertThat(testGrfikon.getPromet()).isEqualTo(UPDATED_PROMET);
    }

    @Test
    @Transactional
    void fullUpdateGrfikonWithPatch() throws Exception {
        // Initialize the database
        grfikonRepository.saveAndFlush(grfikon);

        int databaseSizeBeforeUpdate = grfikonRepository.findAll().size();

        // Update the grfikon using partial update
        Grfikon partialUpdatedGrfikon = new Grfikon();
        partialUpdatedGrfikon.setId(grfikon.getId());

        partialUpdatedGrfikon.region(UPDATED_REGION).promet(UPDATED_PROMET);

        restGrfikonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrfikon.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrfikon))
            )
            .andExpect(status().isOk());

        // Validate the Grfikon in the database
        List<Grfikon> grfikonList = grfikonRepository.findAll();
        assertThat(grfikonList).hasSize(databaseSizeBeforeUpdate);
        Grfikon testGrfikon = grfikonList.get(grfikonList.size() - 1);
        assertThat(testGrfikon.getRegion()).isEqualTo(UPDATED_REGION);
        assertThat(testGrfikon.getPromet()).isEqualTo(UPDATED_PROMET);
    }

    @Test
    @Transactional
    void patchNonExistingGrfikon() throws Exception {
        int databaseSizeBeforeUpdate = grfikonRepository.findAll().size();
        grfikon.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrfikonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, grfikon.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grfikon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grfikon in the database
        List<Grfikon> grfikonList = grfikonRepository.findAll();
        assertThat(grfikonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGrfikon() throws Exception {
        int databaseSizeBeforeUpdate = grfikonRepository.findAll().size();
        grfikon.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrfikonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grfikon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grfikon in the database
        List<Grfikon> grfikonList = grfikonRepository.findAll();
        assertThat(grfikonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGrfikon() throws Exception {
        int databaseSizeBeforeUpdate = grfikonRepository.findAll().size();
        grfikon.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrfikonMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(grfikon)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grfikon in the database
        List<Grfikon> grfikonList = grfikonRepository.findAll();
        assertThat(grfikonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGrfikon() throws Exception {
        // Initialize the database
        grfikonRepository.saveAndFlush(grfikon);

        int databaseSizeBeforeDelete = grfikonRepository.findAll().size();

        // Delete the grfikon
        restGrfikonMockMvc
            .perform(delete(ENTITY_API_URL_ID, grfikon.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Grfikon> grfikonList = grfikonRepository.findAll();
        assertThat(grfikonList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
