package grafikon.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Grfikon.
 */
@Entity
@Table(name = "grfikon")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Grfikon implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "region")
    private String region;

    @Column(name = "promet")
    private Integer promet;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Grfikon id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRegion() {
        return this.region;
    }

    public Grfikon region(String region) {
        this.setRegion(region);
        return this;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public Integer getPromet() {
        return this.promet;
    }

    public Grfikon promet(Integer promet) {
        this.setPromet(promet);
        return this;
    }

    public void setPromet(Integer promet) {
        this.promet = promet;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Grfikon)) {
            return false;
        }
        return id != null && id.equals(((Grfikon) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Grfikon{" +
            "id=" + getId() +
            ", region='" + getRegion() + "'" +
            ", promet=" + getPromet() +
            "}";
    }
}
