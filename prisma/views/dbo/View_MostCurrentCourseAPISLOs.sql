SELECT
  ca.*
FROM
  View_ConsolidatedCourseAPISLOs AS ca
  JOIN (
    SELECT
      entitytitle,
      max(CAST(EntityID AS INT)) AS EntityID
    FROM
      View_ConsolidatedCourseAPISLOs
    GROUP BY
      entitytitle
  ) AS maxend ON ca.EntityID = maxend.EntityID
  AND ca.Entitytitle = maxend.Entitytitle;