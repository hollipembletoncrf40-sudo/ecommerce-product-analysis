import { db } from '../db';
import { randomBytes } from 'crypto';

export async function checkQuota(clientId: string): Promise<{ allowed: boolean; remaining: number }> {
  let usage = await db.userUsage.findUnique({
    where: { clientId }
  });

  if (!usage) {
    // New user, create with default quota
    usage = await db.userUsage.create({
      data: {
        clientId,
        totalQuota: 5 // Default free quota
      }
    });
  }

  const remaining = usage.totalQuota - usage.usageCount;
  return {
    allowed: remaining > 0,
    remaining
  };
}

export async function incrementUsage(clientId: string) {
  await db.userUsage.update({
    where: { clientId },
    data: {
      usageCount: {
        increment: 1
      },
      lastUsedAt: new Date()
    }
  });
}

export async function generateKeys(count: number = 1, usesPerKey: number = 30) {
  const keys = [];
  for (let i = 0; i < count; i++) {
    const key = 'KEY-' + randomBytes(4).toString('hex').toUpperCase();
    keys.push({
      key,
      usesAmount: usesPerKey
    });
  }

  await db.accessKey.createMany({
    data: keys
  });

  return keys;
}

export async function redeemKey(clientId: string, keyString: string) {
  const key = await db.accessKey.findUnique({
    where: { key: keyString }
  });

  if (!key) {
    throw new Error('无效的卡密');
  }

  if (key.isUsed) {
    throw new Error('卡密已被使用');
  }

  // Transaction to ensure atomicity
  await db.$transaction([
    db.accessKey.update({
      where: { key: keyString },
      data: {
        isUsed: true,
        usedByClientId: clientId,
        usedAt: new Date()
      }
    }),
    db.userUsage.upsert({
      where: { clientId },
      create: {
        clientId,
        totalQuota: 5 + key.usesAmount // Base + Topup if new (unlikely case but safe)
      },
      update: {
        totalQuota: {
          increment: key.usesAmount
        }
      }
    })
  ]);

  return { success: true, addedQuota: key.usesAmount };
}
