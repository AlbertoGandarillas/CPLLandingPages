CREATE VIEW [dbo].[CriteriaCategoriesTotals] WITH SCHEMABINDING AS
SELECT
  Res.CriteriaDescription,
  Res.Criteria,
  COUNT(*) AS RecordCount
FROM
  (
    SELECT
      DISTINCT ae.CriteriaDescription,
      ae.Criteria,
      Cri.AceID,
      Cri.TeamRevd
    FROM
      DBO.ACEExhibit Cri
      LEFT OUTER JOIN DBO.AceExhibitCriteria ae ON ae.AceID = Cri.AceID
      AND ae.TeamRevd = Cri.TeamRevd
  ) Res --WHERE Res.CriteriaDescription = 'AC/DC circuits'
GROUP BY
  Res.CriteriaDescription,
  Res.Criteria