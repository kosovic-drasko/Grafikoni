package grafikon.repository;

import grafikon.domain.Grfikon;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Grfikon entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrfikonRepository extends JpaRepository<Grfikon, Long> {}
