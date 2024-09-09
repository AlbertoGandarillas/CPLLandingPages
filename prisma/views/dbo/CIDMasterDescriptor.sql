CREATE VIEW [dbo].[CIDMasterDescriptor] WITH SCHEMABINDING AS
SELECT
  [c-id],
  [c-id_descriptor],
  Institution
FROM
  DBO.MASTER_CID
GROUP BY
  [c-id],
  [c-id_descriptor],
  Institution