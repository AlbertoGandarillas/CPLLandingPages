SELECT
  VeteranID,
  SUM(Units) AS Units
FROM
  (
    SELECT
      EC.VeteranID,
      CASE
        WHEN EC.DefaultAreaEGlobalCreditID IS NULL
        OR EC.DefaultAreaEGlobalCreditID = 0 THEN CASE
          WHEN C.CourseType = 1 THEN CAST(u.unit AS FLOAT)
          ELSE (
            SELECT
              TOP (1) CASE
                WHEN ISNUMERIC(
                  SUBSTRING(
                    Criteria
                    FROM
                      1 FOR 1
                  )
                ) = 1 THEN SUBSTRING(
                  Criteria
                  FROM
                    PATINDEX('%[0-9]%', Criteria) FOR (
                      CASE
                        WHEN PATINDEX(
                          '%[^0-9]%',
                          STUFF(
                            Criteria,
                            1,
                            (PATINDEX('%[0-9]%', Criteria) - 1),
                            ''
                          )
                        ) = 0 THEN LEN(Criteria)
                        ELSE (
                          PATINDEX(
                            '%[^0-9]%',
                            STUFF(
                              Criteria,
                              1,
                              (PATINDEX('%[0-9]%', Criteria) - 1),
                              ''
                            )
                          )
                        ) - 1
                      END
                    )
                )
                ELSE 0
              END
            FROM
              ArticulationCriteria
            WHERE
              ArticulationID = A.ArticulationID
              AND ArticulationType = A.ArticulationType
          )
        END
        ELSE CAST(DAGU.unit AS FLOAT)
      END AS Units
    FROM
      ElegibleCredits AS EC
      LEFT JOIN Articulation AS a ON EC.ArticulationID = a.id
      LEFT JOIN Course_IssuedForm AS c ON c.outline_id = EC.outline_id
      LEFT JOIN tblLookupUnits AS u ON c.unit_id = u.unit_id
      LEFT JOIN ACEExhibit AS ae ON EC.AceExhibitID = AE.ID
      LEFT JOIN ACEExhibitSource AS aes ON ae.SourceID = aes.Id
      LEFT JOIN DefaultAreaEGlobalCredit AS DAG ON EC.DefaultAreaEGlobalCreditID = DAG.ID
      LEFT JOIN tblLookupUnits AS DAGU ON DAG.Min_Unit_id = DAGU.unit_id
  ) AS A
GROUP BY
  VeteranID;