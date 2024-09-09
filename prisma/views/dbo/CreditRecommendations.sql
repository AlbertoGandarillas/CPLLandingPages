CREATE VIEW [dbo].[CreditRecommendations] WITH SCHEMABINDING AS
SELECT
  A.ExhibitID,
  A.Criteria,
  A.AceID,
  A.Title,
  A.FullCriteria
FROM
  (
    SELECT
      DISTINCT E.ID ExhibitID,
      EC.Criteria,
      EC.AceID,
      E.Title,
      CONCAT(
        EC.AceID,
        ' - ',
        E.Title,
        ' - ',
CASE
          WHEN E.VersionNumber IS NOT NULL THEN CONCAT('Version : ', E.VersionNumber)
          ELSE ''
        END,
        ' - ',
        EC.Criteria
      ) FullCriteria
    FROM
      DBO.ACEExhibitCriteria EC
      JOIN DBO.AceExhibit E ON EC.AceID = E.AceID
      AND EC.TeamRevd = E.TeamRevd
      AND EC.StartDate = E.StartDate
      AND EC.EndDate = E.EndDate
  ) A