package com.cofinders.app.service;

import com.cofinders.app.domain.Item;
import com.cofinders.app.repository.ItemRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Item}.
 */
@Service
@Transactional
public class ItemService {

    private final Logger log = LoggerFactory.getLogger(ItemService.class);

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    /**
     * Save a item.
     *
     * @param item the entity to save.
     * @return the persisted entity.
     */
    public Item save(Item item) {
        log.debug("Request to save Item : {}", item);
        return itemRepository.save(item);
    }

    /**
     * Partially update a item.
     *
     * @param item the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Item> partialUpdate(Item item) {
        log.debug("Request to partially update Item : {}", item);

        return itemRepository
            .findById(item.getId())
            .map(
                existingItem -> {
                    if (item.getTitle() != null) {
                        existingItem.setTitle(item.getTitle());
                    }
                    if (item.getDescription() != null) {
                        existingItem.setDescription(item.getDescription());
                    }
                    if (item.getFoundAt() != null) {
                        existingItem.setFoundAt(item.getFoundAt());
                    }
                    if (item.getLat() != null) {
                        existingItem.setLat(item.getLat());
                    }
                    if (item.getLon() != null) {
                        existingItem.setLon(item.getLon());
                    }

                    return existingItem;
                }
            )
            .map(itemRepository::save);
    }

    /**
     * Get all the items.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Item> findAll() {
        log.debug("Request to get all Items");
        return itemRepository.findAll();
    }

    /**
     * Get one item by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Item> findOne(Long id) {
        log.debug("Request to get Item : {}", id);
        return itemRepository.findById(id);
    }

    /**
     * Delete the item by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Item : {}", id);
        itemRepository.deleteById(id);
    }
}
