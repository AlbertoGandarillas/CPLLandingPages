SELECT
  ca.EntityCollegeCode,
  ca.EntityCollegeTitle,
  ca.EntityID,
  ca.EntityTitle,
  ca.EntityLastUpdated,
  ca.EntityStatus,
  ca.EntityCourseTitle,
  ca.EntityCourseShortTitle,
  ca.EntityCourseNumber,
  ca.EntityCourseDescription,
  ca.EntityCourseShortDescription,
  ca.EntityImplementationDate,
  ca.EntitySubject,
  ca.EntityActionType,
  ca.Semester,
  ca.MinUnits,
  ca.MaxUnits,
  ca.RecommendedTOPSCodeValue,
  ca.RecommendedTOPSCodeDisplay,
  ca.UpdatedDate
FROM
  View_ConsolidatedCurrentAPICourses AS ca
  JOIN (
    SELECT
      EntitySubject + EntityCourseNumber AS EntityCourse,
      max(EntityLastUpdated) AS EntityLastUpdated
    FROM
      View_ConsolidatedCurrentAPICourses
    GROUP BY
      EntitySubject + EntityCourseNumber
  ) AS maxend ON ca.EntitySubject + ca.EntityCourseNumber = maxend.EntityCourse
  AND ca.EntityLastUpdated = maxend.EntityLastUpdated;