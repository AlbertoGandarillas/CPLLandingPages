SELECT
  CollegeID,
  CreditRecommendation,
  COUNT(*) AS RecordCount
FROM
  (
    SELECT
      DISTINCT v.CollegeID,
      vc.VeteranId,
      vc.CreditRecommendation,
      firstname,
      lastname
    FROM
      Veteran AS v
      JOIN dbo.VeteranCreditRecommendations AS vc ON vc.VeteranId = v.id
    WHERE
      vc.CreditRecommendation IS NOT NULL
      AND vc.CreditRecommendation <> ''
  ) AS Res
GROUP BY
  CollegeID,
  CreditRecommendation;