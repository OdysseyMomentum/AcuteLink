namespace AcuteLink.Backend.Core.Repository
{
  using System.Collections.Generic;
  using System.Threading.Tasks;

  using AcuteLink.Backend.Core.Entity;

  public class InMemoryCapacityRepository : ICapacityRepository
  {
    /// <inheritdoc />
    public async Task<List<CapacityEntry>> FindNearestSuitableEntitiesAsync(string type, string address)
    {
      switch (type)
      {
        case "ELV":
          return this.GenerateElvData();
        case "Hospital":
          return this.GenerateHospitalData();
        default:
          return new List<CapacityEntry>
                   {
                     new CapacityEntry
                       {
                         Distance = 0.0f,
                         EntityId = "1",
                         EntityName = "Home"
                       }
                   };
      }
    }

    private List<CapacityEntry> GenerateHospitalData()
    {
      return new List<CapacityEntry>
               {
                 new CapacityEntry
                   {
                     Distance = 2630.03f,
                     EntityId = "2",
                     EntityName = "Sint Maartenskliniek, polikliniek Geldrop",
                     FreeBeds = 5,
                     Order = 1,
                     Type = "Hospital"
                   },
                 new CapacityEntry
                   {
                     Distance = 2754.07f,
                     EntityId = "3",
                     EntityName = "St Antonius Utrecht",
                     FreeBeds = 4,
                     Order = 2,
                     Type = "Hospital"
                   },
                 new CapacityEntry
                   {
                     Distance = 2832.9f,
                     EntityId = "4",
                     EntityName = "De Spiker",
                     FreeBeds = 2,
                     Order = 3,
                     Type = "St Antonius Woerden"
                   }
               };
    }

    private List<CapacityEntry> GenerateElvData()
    {
      return new List<CapacityEntry>
               {
                 new CapacityEntry
                   {
                     Distance = 2630.03f,
                     EntityId = "2",
                     EntityName = "De Hale",
                     FreeBeds = 5,
                     Order = 1,
                     Type = "ELV"
                   },
                 new CapacityEntry
                   {
                     Distance = 2754.07f,
                     EntityId = "3",
                     EntityName = "Stichting Kwadrantgroep",
                     FreeBeds = 4,
                     Order = 2,
                     Type = "ELV"
                   },
                 new CapacityEntry
                   {
                     Distance = 2832.9f,
                     EntityId = "4",
                     EntityName = "De Spiker",
                     FreeBeds = 2,
                     Order = 3,
                     Type = "ELV"
                   }
               };
    }
  }
}