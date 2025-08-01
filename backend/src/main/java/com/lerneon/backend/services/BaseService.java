package com.lerneon.backend.services;

import com.lerneon.backend.models.entity.BaseEntity;

import java.io.Serializable;
import java.util.List;

public interface BaseService<T extends BaseEntity, ID extends Serializable> {
    default List<T> findAll() {
        throw new UnsupportedOperationException("Method findAll Not supported yet.");
    }

    default T findById(ID id) {
        throw new UnsupportedOperationException("Method findById Not supported yet.");
    }

    default T create(T entity) {
        throw new UnsupportedOperationException("Method create Not supported yet.");
    }

    default T update(ID id, T entity) {
        throw new UnsupportedOperationException("Method update Not supported yet.");
    }

    default T delete(ID id) {
        throw new UnsupportedOperationException("Method delete Not supported yet.");
    }
}
