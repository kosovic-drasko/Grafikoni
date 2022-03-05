package grafikon.domain;

import static org.assertj.core.api.Assertions.assertThat;

import grafikon.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GrfikonTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Grfikon.class);
        Grfikon grfikon1 = new Grfikon();
        grfikon1.setId(1L);
        Grfikon grfikon2 = new Grfikon();
        grfikon2.setId(grfikon1.getId());
        assertThat(grfikon1).isEqualTo(grfikon2);
        grfikon2.setId(2L);
        assertThat(grfikon1).isNotEqualTo(grfikon2);
        grfikon1.setId(null);
        assertThat(grfikon1).isNotEqualTo(grfikon2);
    }
}
