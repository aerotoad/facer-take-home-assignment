export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class FragileItem extends Item {
  fragile: boolean;

  constructor(name, sellIn, quality, fragile = false) {
    super(name, sellIn, quality);
    this.fragile = fragile;
  }
}


export class FacerStore {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }
  
  /**
   * Updates the quality of all items in the store by iterating over them
   * and calling the appropriate update method based on the item type
   */
  updateQuality() {
    this.items = this.items.map((item) => {
      if (item.name === 'Vintage Rolex') {
        return this.updateVintageRolex(item);
      } else if (item.name === 'Passes to Watchface Conference') {
        return this.updateConferenceItem(item);
      } else if (item.name === 'Legendary Watch Face') {
        return this.updateLegendaryItem(item);
      } else if (item instanceof FragileItem) {
        return this.updateFragileItem(item);
      } else {
        // If the item is not a special item, update it based on the general rules
        // These might be unknown items, so more specific rules can be added as needed
        return this.updateRegularItem(item);
      }
    });
  }
  /**
   * Updates a regular item based on the general rules
   * - Quality decreases by 1 each day
   * - Quality decreases by 2 after sellIn date
   * @param item Item to be updated
   * @returns Updated item
   */
  updateRegularItem(item: Item) {
    if (item.quality > 0) {
      item = this.decreaseQuality(item, 1);
    }
    item.sellIn -= 1;
    if (item.sellIn < 0) {
      // Quality decreases twice as fast after sellIn date
      // We decrease quality by 1 again to make it a total of 2
      item = this.decreaseQuality(item, 1);
    }
    return item;
  }

  /**
   * Updates a fragile item that degrade twice as fast as regular items
   */
  updateFragileItem(item: FragileItem) {
    if (item.fragile) {
      if (item.quality > 0) {
        item = this.decreaseQuality(item, 2) as FragileItem;
      }
      item.sellIn -= 1;
      if (item.sellIn < 0) {
        item = this.decreaseQuality(item, 2) as FragileItem;
      }
    } else {
      throw new Error('Invalid item type');
    }
    return item;
  }

  /**
   * Updates a Vintage Rolex item that increases in quality over time
   */
  updateVintageRolex(item: Item) {
    item = this.increaseQuality(item, 1);
    return item;
  }

  /**
   * Legendary items never change
   * This method is here so we can easily add more specific rules for legendary items in the future
   */
  updateLegendaryItem(item: Item) {
    if (item.name !== 'Legendary Watch Face') {
      throw new Error('Invalid item type');
    }
    // Legendary items never change
    return item;
  }

  /**
   * Update conference item based on conference rules
   * - Quality increases by 1 each day
   * - Quality increases by 2 when sellIn is 10 or less
   * - Quality increases by 3 when sellIn is 5 or less
   * - Quality drops to 0 after sellIn date
   */
  updateConferenceItem(item: Item) {
    if (item.name === 'Passes to Watchface Conference') {
      if (item.sellIn <= 0) {
        item.quality = 0;
      } else if (item.sellIn <= 5) {
        item = this.increaseQuality(item, 3);
      } else if (item.sellIn <= 10) {
        item = this.increaseQuality(item, 2);
      } else {
        item = this.increaseQuality(item, 1);
      }
    } else {
      throw new Error('Invalid item type');
    }
    item.sellIn -= 1;
    return item;
  }

  increaseQuality(item: Item, amount: number) {
    if (item.quality < 50) {
      item.quality += amount;
    }
    if (item.quality > 50) {
      item.quality = 50;
    }
    return item;
  }

  decreaseQuality(item: Item, amount: number) {
    if (item.quality > 0) {
      item.quality -= amount;
    }
    return item;
  }
}
