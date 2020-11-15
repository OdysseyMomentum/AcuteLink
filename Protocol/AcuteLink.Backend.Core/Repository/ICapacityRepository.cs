namespace AcuteLink.Backend.Core.Repository
{
  using System.Collections.Generic;
  using System.Threading.Tasks;

  using AcuteLink.Backend.Core.Entity;

  public interface ICapacityRepository
  {
    Task<List<CapacityEntry>> FindNearestSuitableEntitiesAsync(string type, string address);
  }
}