using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AcuteLink.Backend.Core.Tests
{
  using System;

  using AcuteLink.Backend.Core.Entity;

  [TestClass]
  public class ClientTest
  {
    [TestMethod]
    public void TestClientIsInactiveShouldBeDisplayedOfflineAfterFiveMinutes()
    {
      var client = new Client { LastActive = DateTime.UtcNow.AddMinutes(-5).AddSeconds(-1) };
      Assert.IsFalse(client.IsOnline);
    }

    [TestMethod]
    public void TestClientIsActiveShouldBeDisplayedAsOnline()
    {
      var client = new Client { LastActive = DateTime.UtcNow.AddMinutes(-2) };
      Assert.IsTrue(client.IsOnline);
    }
  }
}
